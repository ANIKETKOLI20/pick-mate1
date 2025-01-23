import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function SingleSelect({ rowId, selectedOptions, updateSelectedOptions }) {
  // Local state for the selected option
  const [selected, setSelected] = useState("");
  const [availableOptions, setAvailableOptions] = useState([]);

  useEffect(() => {
    const defaultOptions = ["Option 1", "Option 2", "Option 3", "Option 4"];

    // Initialize globallySelectedOptions if not present
    const globallySelected = JSON.parse(localStorage.getItem("globallySelectedOptions")) || [];

    // Set default options if not present in localStorage
    if (!localStorage.getItem("defaultOptions")) {
      localStorage.setItem("defaultOptions", JSON.stringify(defaultOptions));
    }

    // Filter available options by excluding globally selected options
    const storedOptions = JSON.parse(localStorage.getItem("defaultOptions"));
    setAvailableOptions(storedOptions.filter(option => !globallySelected.includes(option)));

    // Initialize selected option from locally stored selection
    const selectedOption = globallySelected.find(option => option === selectedOptions[rowId]);
    setSelected(selectedOption || ""); // Set initial state if there's no previous selection
  }, [rowId, selectedOptions]);

  const handleChange = (value) => {
    // Update globallySelectedOptions in localStorage
    let globallySelected = JSON.parse(localStorage.getItem("globallySelectedOptions")) || [];
    if (selected) {
      // Remove the previously selected option
      globallySelected = globallySelected.filter(option => option !== selected);
    }
    if (value) {
      // Add the new selection
      globallySelected.push(value);
    }
    localStorage.setItem("globallySelectedOptions", JSON.stringify(globallySelected));

    setSelected(value);
    updateSelectedOptions(rowId, value);
  };

  return (
    <div>
      {selected ? (
        <button
          className="flex items-center gap-2 p-2 rounded-lg bg-gray-300 text-black hover:bg-gray-600"
          onClick={() => handleChange("")}
        >
          {selected} <span className="ml-2 text-black"><X size={16} /></span>
        </button>
      ) : (
        <select
          className="select select-bordered w-full"
          value={selected}
          onChange={(e) => handleChange(e.target.value)}
        >
          <option value="">Select Option</option>
          {availableOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
