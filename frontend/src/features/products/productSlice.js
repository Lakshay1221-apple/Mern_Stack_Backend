import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getProduct = createAsyncThunk('product/getProduct', async(_,{rejectWithValue}) => {

    try{
        const link = `/api/v1/products/${id}`;
        const {data} = await axios.get(link);
        console.log("Response data:", data.data);
        return data;

    }catch(error){
        return rejectWithValue(error.response?.data || "An error occurred while fetching products.");
    }    
});

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        productCount : 0,
        loading: false,
        error: null,
        product : null
    },
    reducers : {
        removeErrors(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload.products || [];
            state.productCount = action.payload.productCount || 0;
        });
        builder.addCase(getProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to fetch products';
        });

        builder.addCase(getProductDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        add.Case(getProductDetails.fulfilled, (state, action) => {
            console.log("Product details fetched:", action.payload);
            state.loading = false;
            state.product = action.payload.product || null;
            state.error = null;
            state.product = action.payload.product || null; 
        })
        .addCase(getProductDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to fetch product details';
        })
    }
});

export const {removeErrors} = productSlice.actions;
export default productSlice.reducer;