import { IItem, IOrderAndBuyerInfo, IFormError, IAppInfo } from '../types';
import { Model } from '../components/base/Model';

export class AppState extends Model<IAppInfo> {
	productList: IItem[] = [];
	basket: IItem[] = [];
	order: IOrderAndBuyerInfo = {
		payment: '',
		address: '',
		email: '',
		phone: '',
	};
	orderErrors: IFormError = {};
	formType: 'order' | 'contacts';
	preview: string | null;

	setProductList(items: IItem[]) {
		this.productList = items;
		this.emitChanges('items:changed', { catalog: this.productList });
	}

	addToBasket(item: IItem): void {
		this.basket.push(item);
		this.emitChanges('basket:changed', this.basket);
	}

	deleteFromBasket(item: IItem) {
		const indexElement = this.basket.findIndex(
			(basketItem) => basketItem.id === item.id
		);
		this.basket.splice(indexElement, 1);

		this.emitChanges('basket:changed', this.basket);
	}

	isInBasket(item: IItem) {
		return this.basket.some((basketItem) => {
			return basketItem.id === item.id;
		});
	}

	getBasketId() {
		return this.basket.map((item) => item.id);
	}

	getNumberBasket(): number {
		return this.basket.length;
	}

	getTotalBasket(): number {
		return this.basket.reduce((total, item) => {
			return total + (item.price || 0);
		}, 0);
	}

	cleanBasket() {
		this.basket = [];
		this.emitChanges('basket:changed', this.basket);
	}

	setField(field: keyof IOrderAndBuyerInfo, value: string) {
		this.order[field] = value;
		if (field === 'address' || field === 'payment') {
			this.setOrderErrors();
		}

		if (field === 'phone' || field === 'email') {
			this.setContactsErrors();
		}
	}

	setOrderErrors() {
		const errors: IFormError = {};
		if (!this.order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Укажите адрес';
		}
		this.orderErrors = errors;
		this.events.emit('formErrors:change', this.orderErrors);
		return Object.keys(errors).length === 0;
	}

	setContactsErrors() {
		const errors: IFormError = {};

		const validateEmail = (email: string): boolean => {
			const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
			return emailRegex.test(email);
		};

		const validatePhone = (phone: string): boolean => {
			const phoneRegex = /^\+?[1-9]\d{1,14}$/;
			return phoneRegex.test(phone);
		};

		if (!this.order.phone) {
			errors.phone = 'Укажите телефон';
		} else if (!validatePhone(this.order.phone)) {
			errors.phone = 'Некорректный формат телефона';
		}

		if (!this.order.email) {
			errors.email = 'Укажите email';
		} else if (!validateEmail(this.order.email)) {
			errors.email = 'Некорректный формат email';
		}

		this.orderErrors = errors;
		this.events.emit('formErrors:change', this.orderErrors);
		return Object.keys(errors).length === 0;
	}

	clearErrors(): void {
		this.orderErrors = null;
	}
}
