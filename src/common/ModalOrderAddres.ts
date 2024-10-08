import { IOrderFormData } from '../types/index';
import { Form } from './Form';
import { ensureAllElements } from '../utils/utils';
import { IEvents } from '../components/base/events';

export class ModalOrderAddres extends Form<IOrderFormData> {
	protected _paymentButton: HTMLButtonElement[];
	protected _address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._paymentButton = ensureAllElements('.button_alt', this.container);
		this._paymentButton.forEach((button) => {
			button.addEventListener('click', () => {
				this.paymentButton = button.name;
				this.onInputChange('payment', button.name);
			});
		});
	}

	set address(value: string) {
		this._address = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement;
		this._address.value = value;
	}

	set paymentButton(name: string) {
		this._paymentButton.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}
}
