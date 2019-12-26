import {Dialog} from "./Dialog";

export class ButtonChooseDialog extends Dialog{

    constructor(content, title, values) {
        super(content, title);

        Object.keys(values).forEach(key => {
            this.addButton(values[key], key);
        });
    }
}