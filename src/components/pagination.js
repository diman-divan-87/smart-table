import { getPages } from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {
    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнерница переменной, потому что она может меняться при обработке действий позже
    const pageTemplate = pages.firstElementChild.cloneNode(true); // в качестве шаблона берём первый элемент из контейнера со страницами
    pages.firstElementChild.remove(); // и удаляем его (предполагаем, что там больше ничего, как вариант, можно и всё удалить из pages)
    
    let pageCount; // временная переменная для хранения количества страниц
    
    const applyPagination = (query, state, action) => {
        // @todo: #2.1 — посчитать количество страниц, объявить переменные и константы
        const limit = state.rowsPerPage; // будем часто обращаться, чтобы короче записывать
        let page = state.page;

        // @todo: #2.6 — обработать действия
        if (action)
            switch (action.name) {
                case "prev":
                    page = Math.max(1, page - 1);
                    break; // переход на предыдущую страницу
                case "next":
                    page = Math.min(pageCount, page + 1);
                    break; // переход на следующую страницу
                case "first":
                    page = 1;
                    break; // переход на первую страницу
                case "last":
                    page = pageCount;
                    break; // переход на последнюю страницу
            }

        return Object.assign({}, query, {
            limit,
            page
        });
    };

    const updatePagination = (total, { page, limit }) => {
        // вычисляем количество страниц
        pageCount = Math.ceil(total / limit);

        // обновляем отображение страниц (перенос кода из @todo: #2.4)
                const visiblePages = getPages(page, pageCount, 5); // Получим массив страниц, которые нужно показать, выводим только 5 страниц
        // @todo: #2.4 — получить список видимых страниц и вывести их
        pages.replaceChildren(
            ...visiblePages.map((pageNumber) => {
                // перебираем их и создаём для них кнопку
                const el = pageTemplate.cloneNode(true); // клонируем шаблон, который запомнили ранее
                return createPage(el, pageNumber, pageNumber === page); // вызываем колбэк из настроек, чтобы заполнить кнопку данными
            })
        );

        // @todo: #2.5 — обновить статус пагинации
        fromRow.textContent = (page - 1) * limit + 1; // С какой строки выводим
        toRow.textContent = Math.min(page * limit, total); // До какой строки выводим, если это последняя страница, то отображаем оставшееся количество
        totalRows.textContent =total; // Сколько всего строк выводим на всех страницах вместе (после фильтрации будет меньше)
        
    };

    return {
        updatePagination,
        applyPagination
    };
};