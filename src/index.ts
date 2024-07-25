import './scss/styles.scss';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { AppState } from './common/AppState';
import { Basket } from './common/Basket';
import { ModalOrderAddres } from './common/ModalOrderAddres';
import { Page } from './common/Page';
import { Product } from './common/Product';
import { ApiData } from './common/ApiData';
import { Modal } from './common/Modal';
import { ModalOrderContacs } from './common/ModalOrderContacs';
import { ModalOrderDone } from './common/ModalOrderDone';
import {
	IItem,
	IOrderAndBuyerInfo,
	IFormError,
	ICompletedOrder,
} from './types';

const api = new ApiData(CDN_URL, API_URL);

const events = new EventEmitter();

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const productCardBasketTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
const productCardCatalogTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');
const productCardPreviewTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// // Модель данных приложения
const appState = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const contacts = new ModalOrderContacs(cloneTemplate(contactsTemplate), events);
const order = new ModalOrderAddres(cloneTemplate(orderTemplate), events);
const successForm = new ModalOrderDone(cloneTemplate(successTemplate), events);

// Изменились элементы каталога
events.on('items:changed', () => {
	page.productList = appState.productList.map((item) => {
		const product = new Product(
			'card',
			cloneTemplate(productCardCatalogTemplate),
			{
				onClick: () => events.emit('productCard:select', item),
			}
		);
		return product.render({
			title: item.title,
			price: item.price,
			image: item.image,
			category: item.category,
		});
	});
});

events.on('productCard:select', (item: IItem) => {
	const productCard: Product = new Product(
		`card`,
		cloneTemplate(productCardPreviewTemplate),
		{
			onClick: () => {
				appState.addToBasket(item);
				productCard.inBasket = appState.isInBasket(item);
			},
		}
	);
	productCard.inBasket = appState.isInBasket(item);
	modal.render({
		content: productCard.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
		}),
	});
});

// Удалить товар из корзины
events.on('productCard:remove', (item: IItem) => {
	appState.deleteFromBasket(item);
});

// Добавить товар в корзину
events.on('productCard:add', (item: IItem) => {
	appState.addToBasket(item);
});

//Изменить данные корзины
events.on('basket:changed', () => {
	page.counter = appState.getNumberBasket();
	const items = appState.basket.map((item, index) => {
		const productCard = new Product(
			'card',
			cloneTemplate(productCardBasketTemplate),
			{
				onClick: () => {
					events.emit('productCard:remove', item);
				},
			}
		);
		return productCard.render({
			index: index + 1,
			title: item.title,
			price: item.price,
		});
	});

	basket.render({ list: items, total: appState.getTotalBasket() });
});

//Открыть корзину
events.on('basket:open', () => {
	appState;
	modal.render({
		content: basket.render({ list: basket.list, total: basket.total }),
	});
});

// Открыть форму ввода адреса и выбора способа оплаты
events.on('order:open', () => {
	modal.render({
		content: order.render({
			valid: appState.setOrderErrors(),
			errors: [],
		}),
	});
});

// Отправить форму заказа
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			valid: appState.setContactsErrors(),
			errors: [],
		}),
	});
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: IFormError) => {
	const { payment, address, email, phone } = errors;
	order.valid = !payment && !address;
	contacts.valid = !email && !phone;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Открыть форму ввода контактных данных
events.on('contacts:submit', () => {
	api
		.postOrder({
			...appState.order,
			total: appState.getTotalBasket(),
			items: appState.getBasketId(),
		})
		.then((result) => {
			order.resetForm();
			contacts.resetForm();
			events.emit('order:complete', result);
			appState.cleanBasket();
			page.counter = appState.getNumberBasket();
		})
		.catch(console.error);
});

events.on('order:complete', (res: ICompletedOrder) => {
	modal.render({ content: successForm.render({ total: res.total }) });
});

// Открыть форму успешного оформления заказа
events.on('success:finish', () => modal.close());

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// разблокируем прокрутку страницы
events.on('modal:close', () => {
	page.locked = false;
});

// Изменилось одно из полей
events.on(
	/^(order|contacts)\..*:change/,
	(data: { field: keyof IOrderAndBuyerInfo; value: string }) => {
		appState.setField(data.field, data.value);
	}
);

// Получаем товары с сервера
api
	.getProductList()
	.then((result) => {
		appState.setProductList(result);
	})
	.catch((err) => {
		console.error(err);
	});
