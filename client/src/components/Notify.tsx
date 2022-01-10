import React from 'react'


  const Notify = ({errorMessage}: any) => {
      
    if ( !errorMessage ) {
      return null
    }
    return (
      <div style={{color: 'red'}}>
        {errorMessage}
      </div>
    )
  }

  export default Notify