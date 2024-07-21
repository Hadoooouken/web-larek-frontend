import { Component } from '../components/base/Component';
import { ensureElement } from '../utils/utils';
import { IEvents } from '../components/base/events';
import { IFormSubmissionResult } from '../types/index';

export class ModalOrderDone extends Component<IFormSubmissionResult> {
	protected closeButton: HTMLButtonElement;
	protected description: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this.description = ensureElement<HTMLButtonElement>(
			'.order-success__description',
			this.container
		);

		this.closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		this.closeButton.addEventListener('click', () =>
			events.emit('success:finish')
		);
	}

	set total(value: number) {
		this.setText(this.description, `Списано ${value} синапсов `);
	}
}
