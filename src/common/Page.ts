import { IPage } from '../types/index';
import { Component } from '../components/base/Component';
import { ensureElement } from '../utils/utils';
import { IEvents } from '../components/base/events';

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _productList: HTMLElement;
	protected _basket: HTMLButtonElement;
	protected _wrapper: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._productList = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');

		this._counter = ensureElement<HTMLElement>(`.header__basket-counter`);

		this._basket = ensureElement<HTMLButtonElement>(
			`.header__basket`,
			container
		);

		this._basket.addEventListener(`click`, () => {
			this.events.emit(`basket:open`);
		});
	}

	set productList(items: HTMLElement[]) {
		this._productList.replaceChildren(...items);
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set locked(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
	}
}
