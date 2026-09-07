import "./scss/styles.scss";

import { ProductCatalog } from "./components/Models/ProductCatalog";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";

import { Api } from "./components/Base/Api";
import { API_URL, CDN_URL } from "./utils/constants";
import { ApiService } from "./components/Services/ApiService";

import { EventEmitter } from "./components/Base/Events";

import { Gallery } from "./components/view/gallery";
import { ensureElement, cloneTemplate } from "./utils/utils";

import { CatalogCard } from "./components/view/catalogCard";

import { Modal } from "./components/view/modal";
import { PreviewCard } from "./components/view/PreviewCard";
import {
    ICardEvent,
    IFormFieldChange,
    IOrderFormData,
    IContactsFormData,
    TPayment,
    IOrder,
    IProductsResponse,
} from "./types";

import { Header } from "./components/view/header";
import { BasketView } from "./components/view/basketView";
import { BasketCard } from "./components/view/basketCard";

import { OrderForm } from "./components/view/orderForm";
import { ContactsForm } from "./components/view/contactsForm";

import { Success } from "./components/view/success";

// Брокер событий
const events = new EventEmitter();

// Модели данных
const catalog = new ProductCatalog(events);
const basket = new Cart(events);
const buyer = new Buyer(events);

// API
const api = new Api(API_URL, {
    headers: {
        "Content-Type": "application/json",
    },
});
const webLarekApi = new ApiService(api);

// Основные компоненты Представления
const header = new Header(events, ensureElement<HTMLElement>(".header"));
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const modal = new Modal(events, ensureElement<HTMLElement>("#modal-container"));

// Шаблоны
const catalogCardTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const previewCardTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const basketCardTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

// Создание подробной карточки
const previewCard = new PreviewCard(
    events,
    cloneTemplate<HTMLElement>(previewCardTemplate),
);

// Создание представления корзины
const basketView = new BasketView(
    events,
    cloneTemplate<HTMLElement>(basketTemplate),
);

// Создание формы оплаты и адреса
const orderForm = new OrderForm(
    events,
    cloneTemplate<HTMLFormElement>(orderTemplate),
);

// Создание формы контактов
const contactsForm = new ContactsForm(
    events,
    cloneTemplate<HTMLFormElement>(contactsTemplate),
);

// Создание компонента успешного заказа 
const success = new Success(cloneTemplate<HTMLElement>(successTemplate), { 
    onClick: () => { 
        // Эмитим событие вместо прямого вызова modal.close()
        events.emit('success:close');
    }, 
});

// Обработчик события закрытия успешного заказа
events.on('success:close', () => {
    modal.close();
});

// Функция отображения содержимого корзины
const onBasketChanged = (): void => {
    const items = basket.getItems().map((product, index) => {
        const card = new BasketCard(
            cloneTemplate<HTMLElement>(basketCardTemplate),
            {
                onClick: () => {
                    events.emit<ICardEvent>("basket:delete", {
                        id: product.id,
                    });
                },
            },
        );

        return card.render({
            index: index + 1,
            title: product.title,
            price: product.price,
        });
    });

    basketView.render({
        items,
        total: basket.getTotal(),
    });

    header.render({
        counter: basket.getCount(),
    });
};

// Изменение каталога товаров
events.on("catalog:changed", () => {
    const products = catalog.getProducts();

    const cards = products.map((product) => {
        const card = new CatalogCard(
            cloneTemplate<HTMLElement>(catalogCardTemplate),
            {
                onClick: () => {
                    events.emit<ICardEvent>("card:select", {
                        id: product.id,
                    });
                },
            },
        );

        return card.render({
            title: product.title,
            price: product.price,
            category: product.category,
            image: product.image,
        });
    });

    gallery.render({
        catalog: cards,
    });
});

// Выбор карточки в каталоге
events.on<ICardEvent>("card:select", ({ id }) => {
    const product = catalog.getProduct(id);
    if (!product) {
        return;
    }
    catalog.setPreview(product);
});

events.on("preview:changed", () => { 
    const product = catalog.getPreview(); 
    if (!product) { 
        return; 
    } 
 
    const isSelected = basket.hasItem(product.id); 
    const isUnavailable = product.price === null; 
 
    const buttonText = isUnavailable 
        ? "Недоступно" 
        : isSelected 
            ? "Удалить из корзины" 
            : "В корзину"; 
 
    
    const previewContent = previewCard.render({ 
        title: product.title, 
        price: product.price, 
        category: product.category, 
        image: product.image,
        description: product.description, 
        buttonText, 
        buttonDisabled: isUnavailable, 
    }); 
 
    modal.render({ 
        content: previewContent, 
    }); 
 
    modal.open(); 
}); 

// Действие с товаром в подробной карточке
events.on("card:action", () => {
    const product = catalog.getPreview();
    if (!product || product.price === null) {
        return;
    }

    if (basket.hasItem(product.id)) {
        basket.removeItem(product.id);
    } else {
        basket.addItem(product);
    }

    modal.close();
});

// Удаление товара из корзины
events.on<ICardEvent>("basket:delete", ({ id }) => {
    basket.removeItem(id);
});

// Изменение содержимого корзины
events.on("basket:changed", () => {
    onBasketChanged();
});

// Открытие корзины
events.on("basket:open", () => {
    modal.render({
        content: basketView.render(),
    });
    modal.open();
});

// Открытие первой формы
events.on("order:open", () => {
    modal.render({
        content: orderForm.render(),
    });
    modal.open();
});

// Изменение способа оплаты
events.on<IFormFieldChange<IOrderFormData>>(
    "order.payment:change",
    ({ value }) => {
        buyer.setData({
            payment: value as TPayment,
        });
    },
);

// Изменение адреса
events.on<IFormFieldChange<IOrderFormData>>(
    "order.address:change",
    ({ value }) => {
        buyer.setData({
            address: value,
        });
    },
);

// Изменение данных покупателя
events.on("buyer:changed", () => {
    const data = buyer.getData();
    const errors = buyer.validate();

    const orderErrors = [errors.payment, errors.address]
        .filter(Boolean)
        .join("; ");

    const contactsErrors = [errors.email, errors.phone]
        .filter(Boolean)
        .join("; ");

    orderForm.render({
        payment: data.payment,
        address: data.address,
        valid: !errors.payment && !errors.address,
        errors: orderErrors,
    });

    contactsForm.render({
        email: data.email,
        phone: data.phone,
        valid: !errors.email && !errors.phone,
        errors: contactsErrors,
    });
});

// Открытие второй формы
events.on("order:submit", () => {
    modal.render({
        content: contactsForm.render(),
    });
});

// Изменение электронной почты
events.on<IFormFieldChange<IContactsFormData>>(
    "contacts.email:change",
    ({ value }) => {
        buyer.setData({
            email: value,
        });
    },
);

// Изменение телефона
events.on<IFormFieldChange<IContactsFormData>>(
    "contacts.phone:change",
    ({ value }) => {
        buyer.setData({
            phone: value,
        });
    },
);

// Обработка отправки формы контактов
events.on("contacts:submit", () => {
    const buyerData = buyer.getData();

    const order: IOrder = {
        payment: buyerData.payment,
        address: buyerData.address,
        email: buyerData.email,
        phone: buyerData.phone,
        total: basket.getTotal(),
        items: basket.getItems().map((product) => product.id),
    };

    webLarekApi
        .postOrder(order)
        .then((result) => {
            const successContent = success.render({
                total: (result as { total: number }).total,
            });

            modal.render({
                content: successContent,
            });

            basket.clear();
            buyer.clear();
        })
        .catch((error) => {
            console.error("Ошибка оформления заказа:", error);
        });
});

// Закрытие модального окна 
events.on("modal:close", () => { 
    modal.close(); 
}); 
 
// Начальное состояние интерфейса 
basket.clear(); 
buyer.clear(); 
 
// Проверка  
console.log('API_URL:', API_URL); 
console.log('CDN_URL:', CDN_URL); 
console.log('webLarekApi:', webLarekApi); 
 
// Получение товаров с сервера 
webLarekApi
    .getProducts()
    .then((response: IProductsResponse) => {
        // Формируем полный путь к изображению ДО передачи в модель
        const productsWithFullImage = response.items.map((product) => ({
            ...product,
            image: `${CDN_URL}${product.image}`
        }));
        
        // Передаём в модель уже готовые данные
        catalog.setProducts(productsWithFullImage);
        console.log(`Каталог обновлён: ${productsWithFullImage.length} товаров`);
    })
    .catch((error) => {
        console.error("Ошибка загрузки каталога:", error);
    });