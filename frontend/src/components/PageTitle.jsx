import React, { useEffect } from 'react'

const PageTitle = ({ title }) => {

    useEffect (() => {
        document.title =  title;
    }, [title])
 
  return (
    <div>PageTitle</div>
  )
}

export default PageTitle