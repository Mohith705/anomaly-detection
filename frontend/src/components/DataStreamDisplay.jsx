import React from 'react';

const DataStream = ({ data }) => {
    // Function to render data in a formatted way
    const renderData = (obj) => {
        return Object.entries(obj).map(([key, value], index) => (
            <div key={index} className="my-2">
                <h3 className="text-lg text-[#4CAF50]">{key}:</h3>
                <pre className="text-sm text-white bg-[#333333] p-2 rounded">{JSON.stringify(value, null, 2)}</pre>
            </div>
        ));
    };

    return (
        <div className='overflow-y-auto max-h-[300px]'>
            
            <div id="dataDisplay" className="bg-editor-gray text-white p-4 rounded overflow-y-auto">
                {data ? renderData(data) : <p>No data available.</p>}
            </div>
        </div>
    );
};

export default DataStream;
