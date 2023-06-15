import { TextFieldEntry } from "@bpmn-io/properties-panel";
import React from "@bpmn-io/properties-panel/preact/compat";

/**
 * Entry which can be used in a properties group of the properties panel. Allows the definition of a TextFieldEntry
 * which can be hidden if needed. Can be used to create a group with a dynamically changing set of entries based on the
 * values of the entries.
 *
 * @param id Id of the entry
 * @param element The element the properties are displayed for
 * @param label The label of the entry
 * @param getValue callback to get the value represented by this entry.
 * @param setValue callback to set the value represented by this entry.
 * @param debounce Debounce module of the bpmn-js modeler.
 * @param hidden lean flag defining if the entry is hidden or visible.
 * @return {JSX.Element}
 * @constructor
 */
export function HiddenTextFieldEntry({
  id,
  element,
  label,
  getValue,
  setValue,
  debounce,
  hidden,
}) {
  return (
    <>
      {!hidden() && (
        <TextFieldEntry
          id={id}
          element={element}
          label={label}
          getValue={getValue}
          setValue={setValue}
          debounce={debounce}
        />
      )}
    </>
  );
}
