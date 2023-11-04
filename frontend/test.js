
const categories = [...new Set([...products.map(p=>p.category)])]

categories.map(c => console.log({value: c, label: c.split('-').join(' '), checked: false}));