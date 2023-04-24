import React, {useEffect, useState} from 'react';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export default function SingleSelect(props) {

    const [selectedOption, setSelectedOption] = useState(null);
    const [availableOptions,setAvailableOptions] = useState([]);

    const handleChange = (opt) => {
        setSelectedOption(opt);
    };

    useEffect(()=>{
        if(selectedOption!==null) {
            props.parentFunction(selectedOption.value)
        }
    },[selectedOption])

    const createOptionsFromStrings =() =>{
        props.inputStrings.map(val => setAvailableOptions(availableOptions=>[...availableOptions,{value: val,label:val}]));
    }

    const handleShow=()=>{
        if(availableOptions.length===0){
            createOptionsFromStrings();
        }
    }

    useEffect( () =>{
        setSelectedOption(null);
        setAvailableOptions([]);
        createOptionsFromStrings();
    },[props.inputStrings]);

    return (
        <div onClick={handleShow}>

            <Select
                className="basic-single"
                classNamePrefix="select"
                name="color"
                components={animatedComponents}
                options={availableOptions}
                onChange={handleChange}
                isSearchable={true}
            />

        </div>
    );

}