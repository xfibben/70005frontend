import React, { useState, useEffect } from 'react';

const CustomSelect = ({ options, label, name, value, onChange, placeholder }) => {
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [inputValue, setInputValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (inputValue === '') {
            setFilteredOptions(options);
        } else {
            const toUpperCase = inputValue.toUpperCase();
            setFilteredOptions(
                options.filter(option =>
                    option.name.toUpperCase().includes(toUpperCase)
                )
            );
        }
    }, [inputValue, options]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setShowDropdown(true);
    };

    const handleOptionClick = (option) => {
        onChange({ target: { name, value: option.id } });
        setInputValue(option.name);
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type="text"
                name={name}
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            />
            {showDropdown && filteredOptions.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredOptions.map(option => (
                        <li
                            key={option.id}
                            onClick={() => handleOptionClick(option)}
                            className="cursor-pointer select-none py-2 px-4 text-gray-700 hover:bg-indigo-600 hover:text-white"
                        >
                            {option.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;
