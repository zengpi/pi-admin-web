import { FormFieldType } from "@/model/enums/components/workflow";

import PiInput from "./PiInput.vue"
import PiInteger from "./PiInteger.vue"
import PiRadio from "./PiRadio.vue"
import PiSelect from "./PiSelect.vue"
import PiDateTime from "./PiDateTime.vue"

export default class FormComponentFactory {
    public static getComponent(fieldType?: string) {
        switch (fieldType) {
            case FormFieldType.TEXT:
                return PiInput;
            case FormFieldType.INTEGER:
                return PiInteger;
            case FormFieldType.DATETIME:
                return PiDateTime;
            case FormFieldType.DROPDOWN:
                return PiSelect;
            case FormFieldType.RADIO_BUTTONS:
                return PiRadio;
            default:
                return PiInput;
        }
    }
}