import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const comparator = createComparison(
        ['skipEmptyTargetValues'], // если поле поиска пустое — ничего не фильтруем
        [rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)]
    );
    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        console.log('data = ', data)
        console.log('state = ', state)
        // state.data = state.search
        state.customer = state.search
        // state.seller = state.search
        return data.filter(row => comparator(row, state, action));
        // return data
    }
}