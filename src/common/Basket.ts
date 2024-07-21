import { Component } from '../components/base/Component';
import { createElement, ensureElement } from '../utils/utils';
import { IEvents } from '../components/base/events';
import { IBasketInfo } from '../types/index';

export class Basket extends Component<IBasketInfo> {
	protected orderButton: HTMLButtonElement;
	protected _list: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this.orderButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this.orderButton.addEventListener('click', () => {
			events.emit('order:open');
		});

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
	}

	get list(): HTMLElement[] {
		return Array.from(this._list.children).filter(
			(node) => node instanceof HTMLLIElement
		) as HTMLElement[];
	}

	set list(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.setDisabled(this.orderButton, false);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setDisabled(this.orderButton, true);
		}
	}

	get total(): number {
		return parseInt(this._total.textContent) || 0;
	}

	set total(total: number) {
		this.setText(this._total, total + ' синпсов');
	}
}

// import {Component} from "../base/Component";
// import {cloneTemplate, createElement, ensureElement, formatNumber} from "../../utils/utils";
// import {EventEmitter} from "../base/events";

// interface IBasketView {
//     items: HTMLElement[];
//     total: number;
//     selected: string[];
// }

// export class Basket extends Component<IBasketView> {
//     protected _list: HTMLElement;
//     protected _total: HTMLElement;
//     protected _button: HTMLElement;

//     constructor(container: HTMLElement, protected events: EventEmitter) {
//         super(container);

//         this._list = ensureElement<HTMLElement>('.basket__list', this.container);
//         this._total = this.container.querySelector('.basket__total');
//         this._button = this.container.querySelector('.basket__action');

//         if (this._button) {
//             this._button.addEventListener('click', () => {
//                 events.emit('order:open');
//             });
//         }

//         this.items = [];
//     }

//     set items(items: HTMLElement[]) {
//         if (items.length) {
//             this._list.replaceChildren(...items);
//         } else {
//             this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
//                 textContent: 'Корзина пуста'
//             }));
//         }
//     }

//     set selected(items: string[]) {
//         if (items.length) {
//             this.setDisabled(this._button, false);
//         } else {
//             this.setDisabled(this._button, true);
//         }
//     }

//     set total(total: number) {
//         this.setText(this._total, formatNumber(total));
//     }
// }
