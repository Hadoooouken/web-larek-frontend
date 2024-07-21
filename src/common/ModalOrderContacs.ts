import { Form } from '../common/Form';
import { IBuyerInfo } from '../types';
import { IEvents } from '../components/base/events';

export class ModalOrderContacs extends Form<IBuyerInfo> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}
}
