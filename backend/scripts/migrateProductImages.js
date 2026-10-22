import crypto from 'node:crypto';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import { connectMongoDatabase } from '../config/db.js';

dotenv.config({ path: './backend/config/config.env' });

const DRY_RUN = !process.argv.includes('--apply');
const WIKIMEDIA_API_URL = 'https://commons.wikimedia.org/w/api.php';
const REQUEST_TIMEOUT_MS = 10000;

const verifiedImageOverrides = new Map([
    [
        'classic cotton t-shirt',
        'https://upload.wikimedia.org/wikipedia/commons/b/b3/Ironed_blue_T-shirt_%28001%29.JPG'
    ],
    [
        'slim fit denim jeans',
        'https://images.unsplash.com/photo-1542272604-787c3835535d'
    ],
    [
        'jeans',
        'https://upload.wikimedia.org/wikipedia/commons/0/0c/Jeans_2009.jpg'
    ],
    [
        'classic black hoodie',
        'https://upload.wikimedia.org/wikipedia/commons/c/c4/Spenser_Olson_Hoodie_Black_and_White.png'
    ]
]);

const normalise = (value) => value.trim().toLowerCase();

const isValidImageEntry = (entry) =>
    typeof entry?.public_id === 'string' &&
    entry.public_id.trim().length > 0 &&
    typeof entry?.url === 'string' &&
    entry.url.trim().length > 0;

const isAccessibleImageUrl = async (url) => {
    try {
        new URL(url);
    } catch {
        return false;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            method: 'HEAD',
            redirect: 'follow',
            signal: controller.signal
        });
        const contentType = response.headers.get('content-type') || '';
        if (response.status === 429 || response.status >= 500) {
            return null;
        }
        return response.ok && contentType.toLowerCase().startsWith('image/');
    } catch {
        return null;
    } finally {
        clearTimeout(timeout);
    }
};

const getWikimediaCandidate = async (product) => {
    const override = verifiedImageOverrides.get(normalise(product.name));
    if (override) {
        return override;
    }

    const search = `${product.name} ${product.category}`;
    const query = new URLSearchParams({
        action: 'query',
        generator: 'search',
        gsrsearch: search,
        gsrnamespace: '6',
        gsrlimit: '10',
        prop: 'imageinfo',
        iiprop: 'url',
        iiurlwidth: '1200',
        format: 'json',
        origin: '*'
    });
    const response = await fetch(`${WIKIMEDIA_API_URL}?${query}`, {
        headers: { 'User-Agent': 'E-commerce-product-image-migration/1.0' }
    });

    if (!response.ok) {
        throw new Error(`Wikimedia search failed with HTTP ${response.status}`);
    }

    const data = await response.json();
    const pages = Object.values(data.query?.pages || {});
    const productWords = normalise(`${product.name} ${product.category}`)
        .split(/[^a-z0-9]+/)
        .filter((word) => word.length > 2);

    const candidates = pages
        .map((page) => ({
            title: page.title || '',
            url: page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url
        }))
        .filter((candidate) => candidate.url)
        .sort((left, right) => {
            const score = (title) =>
                productWords.reduce(
                    (total, word) => total + (normalise(title).includes(word) ? 1 : 0),
                    0
                );
            return score(right.title) - score(left.title);
        });

    for (const candidate of candidates) {
        if (await isAccessibleImageUrl(candidate.url)) {
            return candidate.url;
        }
    }

    return null;
};

const makePublicId = (url) =>
    `wikimedia-${crypto.createHash('sha256').update(url).digest('hex').slice(0, 16)}`;

const main = async () => {
    let updated = 0;
    let skipped = 0;
    let failed = 0;
    const results = [];

    try {
        await connectMongoDatabase();
        const products = await Product.find({}, { name: 1, description: 1, category: 1, image: 1 })
            .sort({ _id: 1 })
            .lean();

        for (const product of products) {
            const existingImages = Array.isArray(product.image)
                ? product.image.filter(isValidImageEntry)
                : [];
            let hasValidImage = false;
            for (const existingImage of existingImages) {
                const verification = await isAccessibleImageUrl(existingImage.url);
                if (verification === true) {
                    hasValidImage = true;
                    break;
                }
                if (verification === null) {
                    hasValidImage = true;
                    break;
                }
            }

            if (hasValidImage) {
                skipped += 1;
                results.push({ name: product.name, status: 'skipped', reason: 'valid image exists' });
                continue;
            }

            try {
                const url = await getWikimediaCandidate(product);
                if (!url || (await isAccessibleImageUrl(url)) !== true) {
                    failed += 1;
                    results.push({
                        name: product.name,
                        status: 'failed',
                        reason: 'No accessible image candidate found'
                    });
                    continue;
                }

                const image = [{ public_id: makePublicId(url), url }];
                if (!DRY_RUN) {
                    await Product.updateOne({ _id: product._id }, { $set: { image } });
                }
                updated += 1;
                results.push({ name: product.name, status: DRY_RUN ? 'would update' : 'updated', url });
            } catch (error) {
                failed += 1;
                results.push({
                    name: product.name,
                    status: 'failed',
                    reason: error instanceof Error ? error.message : String(error)
                });
            }
        }

        console.log(`Product image migration (${DRY_RUN ? 'dry-run' : 'apply'})`);
        console.log(`Products examined: ${products.length}`);
        console.log(`Updated${DRY_RUN ? ' (proposed)' : ''}: ${updated}`);
        console.log(`Skipped: ${skipped}`);
        console.log(`Failed: ${failed}`);
        for (const result of results) {
            console.log(`${result.status}: ${result.name}${result.url ? ` -> ${result.url}` : ` (${result.reason})`}`);
        }
    } finally {
        await mongoose.disconnect();
    }
};

main().catch((error) => {
    console.error(`Product image migration failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
});
