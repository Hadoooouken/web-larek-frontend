# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Типы данных

#### Интерфейс карточки

```
interface IItem {
id: string;
description: string;
image: string;
title: string;
category: string;
price: number;
}
```

#### Интерфейс заказа

```
interface IOrder {
payment: PaymentType;
address: string;
email: string;
phone: string;
items: string[];
total: number;
}
```

#### Выбор способа оплаты

```
type PaymentType = 'online' | 'cash';
```

#### Модель данных заказа

```
interface IOrderDataModel {
buyerFullData: IOrder;
payment: PaymentType;
address: string;
email: string;
phone: string;
items: string[];
total: number;
}
```

#### Данные апи сервера

```
export interface IApiData {
fetchProductCards(): Promise<{ items: IItem[] }>;
fetchProductCard(id: string): Promise<IItem>;
submitOrder(orderData: IOrder): Promise<object>;
}
```

#### Модель данных корзины

```
export interface IBasketDataModel {
addItem(item: Partial<IItem>): void;
removeItem(item: Partial<IItem>): void;
clear(): void;
total: number;
}
```

#### Представление корзины

```
export interface IBasketUI {
addItem(item: HTMLElement, itemId: string, sum: number): void;
removeItem(itemId: string): void;
clear(): void;
}
```

#### Интерфейс эмиттера

```
export interface IEventEmitter<T extends string> {
emit: (event: T, data?: unknown) => void;
}
```

#### Данные которые мы передаем в эмиттер

```
export interface IEventData {
element: HTMLElement;
data?: Partial<IItem>;
}
```

#### Интерфейс отображения

```
 interface IView {
	render(data?: unknown): HTMLElement;
	toggleClass(element: HTMLElement, className: string): void;
  }
```

#### Интерфейс отображения модального окна

```
interface IModalView {
	openModal: (element: HTMLElement) => void;
	closeModal: () => void;
    }
```

## Архитектура приложения

Код приложения разделён на 3 слоя согласно парадигме MVP:

Слой данных Modal отвечает за хранение и изменение данных, слой представления Viev отвечает за отображение данных на странице, Слой свзи представления и данных осуществляется через событийно ориентированный подход, для него используется класс EventEmitter, слой реализован императивным кодом в файле `index.ts`

## Классы

#### EventEmitter

Поля: 
-`export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }
}`

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.

Конструктор: constructor() {this._events = new Map<EventName, Set<Subscriber>>();} - выполняет инициализацию объекта, создавая пустую структуру данных для хранения событий

Поля:

events = new Map<EventName, Set<Subscriber>>() - используется для хранения информации о событиях и их подписчиках
Основные методы, реализуемые классом описаны интерфейсом IEvents:

- `on` - установка обработчика на событие
- `off` - снятие обработчика с события
- `emit` - инициализация события
- `rigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие
- `onAll` - установка слушашателя на все события
- `offAll` - сброс всех обработчиков с события

#### Api

Класс представляет собой универсальный инструмент для взаимодействия с веб-сервисами. Он инкапсулирует логику HTTP-запросов, обеспечивая удобный интерфейс для отправки и получения данных.

Поля:
- `baseUrl`: Строковая перекменная, хранящая базовый URL веб-сервиса.
- `options`: Объект настроек запроса, включающий заголовки, необходимые для корректной отправки данных.

Конструктор:

- Принимает `baseUrl` и необязательные `options`, инициализируя базовый URL и настройки запроса.

Методы класса:

- `handleResponse`: Защищенный метод, обрабатывающий ответ от сервера, преобразуя его в JSON и управляя ошибками.
- `get`: Метод для выполнения GET-запроса к указанному URI.
- `post`:- Принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется POST запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове

#### DataApi

Класс Наследуетcя от Api, реализует интерфейс IDataApi.

Поля наследуются от родительского класса

Конструктор:

- `constructor(baseUrl: string, options: RequestInit = {}):` - Инициализирует экземпляр класса DataApi, вызывая конструктор базового класса Api с параметрами baseUrl и options.

Методы:

- `getItems` - выполняет GET запрос, возвращает промис с массивом товаров
- `getItem` - выполняет GET запрос, возвращает промис с одним товаром
- `sendOrder` - выполняет POST запрос, возвращает промис с ответом сервера

#### Абстрактный класс View

Принадлежит слою представления. Реализует интерфейс IView. В конструкторе класса передаются DOM-элемент, EventEmitter и инициализируются события. Данные для отображения в классе, передаются в метод render()

Конструктор:

constructor(element: HTMLElement, events?: IEventEmitter) {
    this.element = element;
    if(events) this.events = events;
}

Поля:

- `element` Элемент DOM, с которым работает представление.
- `events` Экземпляр IEventEmitter для управления событиями.

обладет Методами:

- `toggleClass` - переключение класса
- `setDisable` - деактивация кнопок
- `setActive` - активация кнопок
- `setHidden` - скрытие элемента
- `setVisible` - отображение элемента
- `setText` - установка текста
- `setImage` - установка изображения
- `render` - Отображение данных.

#### ItemView

Класс Принадлежит слою представления, наследует логику от View и принимает данные товара в конструктор Этот класс предназначен для отображения и управления элементами товара.

Конструктор: 

-` construcor(element: HTMLElement, events: IEventEmitter):` Инициализирует экземпляр класса ItemView, вызывая конструктор базового класса View с параметрами element и events. 
 и настраивает HTML-элементы.

- `render` реализует разметку элемента и принимает данные для отображения карточки товара

#### ModalView

Класс относится к слою представления. Реализует интерфейс IModalView Наследуется от View. Обеспечивает возможность открытия/закрытия модального окна. В конструктор принимает экземпляр EventEmitter `private constructor(events: IEventEmitter)`.

- `openModal` - открывает модальное окно
- `closeModal` - закрывает модальное окно

Поля:

- `closeButton` - Кнопка для закрытия модального окна.
- `finishButton` - Кнопка для завершения действия в модальном окне (не используется в текущем коде).
- `container` - Контейнер для содержимого модального окна.
- `modal` - Элемент модального окна.
- `events` - Экземпляр интерфейса IEventEmitter для управления событиями.
- `item` - Объект товара (не используется в текущем коде).
- `page` - Элемент страницы, который блокируется при открытии модального окна.



#### BasketView

Класс Относится к слою представления. Реализует интерфейс IBasketViev Наследует от View. Реализует разметку корзины покупателя. В конструктор принимает экземпляр EventEmitter. `constructor(element: HTMLElement, events: IEventEmitter)` - вызывает конструктор базового класса View с параметрами element и events. Настраивает элементы корзины и добавляет обработчики событий для открытия модального окна и оформления заказа.



методы:

- `render` - переопределяет родительский метод возвращает разметку корзины и принимает данные корзины ( элементы карточек, сумму товаров и кнопку покупки)

#### FormView

Класс относится к слою представления. Наследует от View.

Конструктор:

`constructor(element: HTMLElement, events: IEventEmitter)` - Настраивает элементы формы и добавляет обработчики событий для выбора способа оплаты и отправки формы.

Поля:

- `paymentCashButton` - Кнопка выбора оплаты наличными.
- `paymentCardButton` - Кнопка выбора оплаты картой.
- `adressInput` - Поле ввода адреса.
- `adressInputError` - Элемент для отображения ошибки ввода адреса.
- `payment` - Выбранный способ оплаты.
- `address`- Введенный адрес.

Обеспечивает потомков следующими методами:

- `checkSubmitButtonState` - меняет состояние кнопки сабмита
- `checkIfValidated` - показывает ошибки, если пользователь вводит неверную информацию в форму
- `setupInputValidation` - инициализирует валидацию инпутов в формах
- `additionalRequirements` - метод проверки дополнительных условий для валидации форм, переопределяется в подклассах



#### BasketModel

Класс относится к слою модели. Реализует хранение и изменение данных товаров в корзине покупателя. В конструктор принимает экземпляр `EventEmitter`. `constructor(protected events: IEventEmitter)`. Массив с товарами будет храниться в классе ItemList

Поля:

- `_items` - Карта, хранящая идентификаторы товаров и их количество.
- `_total` - Общее количество товаров в корзине.
- `_order` - Заказ, связанный с корзиной.
- `events` - Экземпляр интерфейса IEventEmitter для управления событиями.

Имеет три метода и 2 геттера:

- `add` - добавляет товар в корзину
- `remove` - удаляет товар из корзины
- `clear` - очищает корзину
- `get items` - возвращает все товары, которые лежат в корзине
- `get total` - возвращает сумму заказа

#### OrderModel 

Класс относится к слою модели. Реализует хранение и изменение данных о покупке. Реализует разметку сообщения об успешной покупке. имплементируется интерфейсом IOrderDataModel

Владеет Геттером для возвращения полных данных заказа и Сэтерами для установки типа оплаты, адреса, элекронной почты, номера телефона, купленных товаров может устанавливать сумму заказа

- `constructor(basket: IBasketDataModel)`- Инициализирует экземпляр класса OrderModel, устанавливает начальные значения для полей и принимает корзину покупок в качестве параметра.

В классе OrderModel есть следующие поля:

- `payment: PaymentType | null` - Хранит информацию о типе оплаты.
- `address: string` - Хранит адрес клиента.
- `email: string` - Хранит email клиента.
- `phone: string` - Хранит телефон клиента.
- `items: string[]` - Хранит список товаров в заказе.
- `total: number` - Хранит общую сумму заказа.

Методы

- `set payment(paymentType: PaymentType)`- Устанавливает тип оплаты и обновляет соответствующее свойство в customerFullInfo.
- `get payment(): PaymentType`- Возвращает текущий тип оплаты.
- `set address(address: string)`- Устанавливает адрес и обновляет соответствующее свойство в customerFullInfo.
- `get address(): string`- Возвращает текущий адрес.
- `set email(email: string)`- Устанавливает email и обновляет соответствующее свойство в customerFullInfo.
- `get email(): string`- Возвращает текущий email.
- `set phone(phone: string)`- Устанавливает телефон и обновляет соответствующее свойство в customerFullInfo.
- `get phone(): string`- Возвращает текущий телефон.
- `set items(items: string[])`- Устанавливает список товаров и обновляет соответствующее свойство в customerFullInfo.
- `get items(): string[]`- Возвращает текущий список товаров.
- `set total(total: number)`- Устанавливает общую сумму заказа и обновляет соответствующее свойство в customerFullInfo.
- `get total(): number`- Возвращает текущую общую сумму заказа.
- `get customerFullInfo()`- IOrder: Возвращает объект customerFullInfo, содержащий всю информацию о заказе.

#### Component

Класс является абстрактным базовым классом для создания компонентов пользовательского интерфейса. Он предоставляет общие методы для управления элементами DOM и взаимодействия с ними.
Конструктор:

`-constructor(container: HTMLElement, events: IEvents)` - конструктор принимает принимает DOM-элемент и экземпляр класса EventEmmiter

`-container: HTMLElement` - DOM-элемент контейнера

`events: IEvents` - брокер событий

- `Constructor` - Принимает HTMLElement, который служит контейнером для компонента.

- `toggleClass` - Метод для переключения CSS класса у элемента.

- `setText` - Устанавливает текстовое содержимое элемента. Принимает любой тип данных и преобразует его в строку.

- `setDisabled` - Изменяет атрибут disabled элемента в зависимости от переданного булевого значения state.

- `setHidden` и - `setVisible` - Методы для управления видимостью элемента, изменяя свойство display CSS.

- `setImage` - Устанавливает атрибуты src и alt для элемента HTMLImageElement, позволяя изменять изображение и его альтернативный текст.

- `render` - Возвращает корневой элемент DOM компонента. Может принимать необязательный параметр data для обновления состояния компонента перед рендерингом.

Этот класс предназначен для наследования и расширения его функциональности в конкретных компонентах пользовательского интерфейса. Он обеспечивает базовый набор инструментов для работы с DOM, что упрощает создание и управление компонентами.

#### ItemList

Класс отвечает за хранение и логику работы с данными карточки продукта. Класс наследуется от абстрактного класса Component

Конструктор наследуется от абстрактного класса Component.

Поля класса:

- `id: string` - уникальный номер товара
- `description`: string - описание товара
- `image`: string - изображение товара
- `title`: string - наименование товара
- `category`: string - категория, к которой относится товар
- `price`: number - стоимость товара

Методы:

- `getId()` - получение уникального номера
- `setTitle()` - установка наименования товара
- `setPrice()` - установка стоимости товара
- `setDescription()` - установка описания товара
- `setCategory()` - установка категории товара
- `setImage()` - установка изображения товара
