import React from "react";

interface TextInput{
    type : string,
    label : string,
    pattern? : string,
    placeholder? : string,
    id : string ,
    [key: string]: any; // Additional props for flexibility (e.g., onChange, onBlur, etc.)
}

const TextInput: React.FC<TextInput> = ({type,label,pattern,placeholder,id,...props}) =>{
    return (
        <div className="flex flex-col my-2">
          <label className="text-gray-800">
            {label}
          </label>
          <input type={type} id={id} pattern={pattern} className="border-b-2 w-auto px-2 py-1" placeholder={placeholder} {...props}></input>
        </div>
      )
}

export default TextInput;