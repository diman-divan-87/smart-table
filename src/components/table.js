import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const { tableTemplate, rowTemplate, before, after } = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    before.reverse().forEach((subName) => {
        // перебираем нужный массив идентификаторов
        root[subName] = cloneTemplate(subName); // клонируем и получаем объект, сохраняем в таблице
        root.container.prepend(root[subName].container); // добавляем к таблице после (append) или до (prepend)
    });
    after.forEach((subName) => {
        // перебираем нужный массив идентификаторов
        root[subName] = cloneTemplate(subName); // клонируем и получаем объект, сохраняем в таблице
        root.container.append(root[subName].container); // добавляем к таблице после (append) или до (prepend)
    });
    
    // @todo: #1.3 —  обработать события и вызвать onAction()
    // Обработчик события change
    root.container.addEventListener("change", () => {
        onAction(); // вызываем без аргументов
    });

    // Обработчик события reset
    root.container.addEventListener("reset", () => {
        setTimeout(() => {
            onAction(); // отложенный вызов после очистки полей
        }, 0);
    });

    // Обработчик события submit
    root.container.addEventListener("submit", (e) => {
        e.preventDefault(); // предотвращаем стандартное поведение
        onAction(e.submitter); // передаем сабмиттер
    });

    const render = (data) => {
        // Преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map((item) => {
            // Клонируем шаблон строки
            const row = cloneTemplate(rowTemplate);
            // Перебираем ключи данных и заполняем соответствующие элементы
            Object.keys(item).forEach((key) => {
                // Проверяем, существует ли элемент с таким ключом в row.elements
                if (row.elements[key]) {
                    // Присваиваем значение из данных в textContent элемента
                    row.elements[key].textContent = item[key];
                }
            });
            return row.container;
        });

        root.elements.rows.replaceChildren(...nextRows);
    };

    return { ...root, render };
}
