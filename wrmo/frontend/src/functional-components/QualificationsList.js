import React from 'react'

const QualificationsList = ({ requirements }) => {
    return (
        <ul>
            {requirements.map((item) => (
                <li className="fw-bolder">
                    {item}
                </li>
            ))}
        </ul>
    )
}

export default QualificationsList