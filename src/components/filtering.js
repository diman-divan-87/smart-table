export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        // @todo: #4.1 — заполнить выпадающие списки опциями
        Object.keys(indexes) // Получаем ключи из объекта
            .forEach((elementName) => {
                // Перебираем по именам
                elements[elementName].append(
                    // в каждый элемент добавляем опции
                    ...Object.values(indexes[elementName]) // формируем массив имён, значений опций
                        .map((name) => {
                            // используйте name как значение и текстовое содержимое
                            // @todo: создать и вернуть тег опции
                            const el = document.createElement("option");
                            el.textContent = name;
                            el.value = name;
                            return el;
                        })
                );
            });
    };

    const applyFiltering = (query, state, action) => {
        // код с обработкой очистки поля

        // @todo: #4.5 — отфильтровать данные, используя компаратор
        const filter = {};
        Object.keys(elements).forEach((key) => {
            if (elements[key]) {
                if (["INPUT", "SELECT"].includes(elements[key].tagName) && elements[key].value) {
                    // ищем поля ввода в фильтре с непустыми данными
                    filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
                }
            }
        });

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
    };

    return {
        updateIndexes,
        applyFiltering,
    };
}
