import React from 'react';

const JsonDisplay = ({ data }) => {
    const renderData = (obj) => {
        return Object.keys(obj).map(key => {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                return (
                    <div key={key} style={{ margin: '10px', padding: '10px', borderLeft: '2px solid gray' }}>
                        <h3>{key}</h3>
                        {renderData(obj[key])} {/* Recursive call for nested objects */}
                    </div>
                );
            }
            return (
                <div key={key} style={{ margin: '5px 0' }}>
                    <strong>{key}:</strong> {JSON.stringify(obj[key])}
                </div>
            );
        });
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', color: '#fff' }} className='bg-editor-gray'>
            {renderData(data)}
        </div>
    );
};

export default JsonDisplay;
