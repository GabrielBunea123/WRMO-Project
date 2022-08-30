import React from 'react'

const NewQualification = ({value, handleSubmitNew, handleQualificationChange, incomplete}) => {
    return (
        <div class="input-group mt-3 mb-3">
            <input value={value} onChange={handleQualificationChange} type="text" class="form-control" placeholder="Requirement" />
            <button onClick={handleSubmitNew} class="input-group-text btn" style={{color:"#0d6efd"}}><i class="fa-solid fa-check"></i></button>
        </div>
    )
}

export default NewQualification