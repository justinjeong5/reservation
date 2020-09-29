const express = require('express');
const app = express();
const db = require('./lib/db');

app.use(express.json());
app.use('/static', express.static('public'));
app.set('views', './views');
app.engine('html', require('ejs').renderFile);

app.get('/', (request, response) => {
    response.render('main.html');
});

app.get('/api/products', (request, response) => {
    if (request.query.start === undefined) {
        request.query.start = 0;
    }
    let res = {};
    if (request.query.categoryId === undefined) {
        db.query(`SELECT count(*) AS count FROM product`, (err, result) => {
            if (err) throw err;
            res = {
                "totalCount": result[0].count
            }
            db.query(`
            SELECT DISTINCT
            display_info.id AS displayInfoId,
            display_info.place_name AS placeName, 
            product.content AS productContent,
            product.description AS productDescription,
            product.id AS productId,
            file_info.save_file_name AS productImageUrl FROM product
            INNER JOIN display_info ON product.id = display_info.product_id
            INNER JOIN product_image ON product.id = product_image.product_id
            INNER JOIN file_info ON product_image.file_id = file_info.id
            WHERE product_image.type='th' ORDER BY product.id ASC LIMIT 4 OFFSET ?;
            `, [parseInt(request.query.start)], (err2, result2) => {
                if (err2) throw err2;
                let items = [];
                for (let item of result2) {
                    let temp = {
                        displayInfoId: item.displayInfoId,
                        productId: item.productId,
                        productDescription: item.productDescription,
                        placeName: item.placeName,
                        productContent: item.productContent,
                        productImageUrl: item.productImageUrl
                    };
                    items.push(temp);
                }
                res = {
                    ...res,
                    items
                }
                response.json(res);
            });
        });
    } else {
        db.query(`SELECT count(*) AS count FROM product WHERE category_id = ?`, [parseInt(request.query.categoryId)], (err, result) => {
            if (err) throw err;
            res = {
                "totalCount": result[0].count
            }
            db.query(`
            SELECT DISTINCT
            display_info.id AS displayInfoId,
            display_info.place_name AS placeName, 
            product.content AS productContent,
            product.description AS productDescription,
            product.id AS productId,
            file_info.save_file_name AS productImageUrl FROM product
            INNER JOIN display_info ON product.id = display_info.product_id
            INNER JOIN product_image ON product.id = product_image.product_id
            INNER JOIN file_info ON product_image.file_id = file_info.id
            
            WHERE product_image.type='th' AND product.category_id = ? ORDER BY product.id ASC LIMIT 4 OFFSET ?;
            `, [parseInt(request.query.categoryId), parseInt(request.query.start)], (err2, result2) => {
                if (err2) throw err2;
                let items = [];
                for (let item of result2) {
                    let temp = {
                        displayInfoId: item.displayInfoId,
                        productId: item.productId,
                        productDescription: item.productDescription,
                        placeName: item.placeName,
                        productContent: item.productContent,
                        productImageUrl: item.productImageUrl
                    };
                    items.push(temp);
                }
                res = {
                    ...res,
                    items
                }
                response.json(res);
            });
        });
    }
})

app.get('/api/promotions', (request, response) => {
    let res = {};
    db.query(`
        SELECT promotion.id AS id,
        product.id AS productId,
        file_info.save_file_name AS productImageUrl
        FROM promotion
        INNER JOIN product ON promotion.product_id = product.id
        INNER JOIN product_image ON product.id = product_image.product_id
        INNER JOIN file_info ON product_image.file_id = file_info.id
        WHERE product_image.type='th';
        `, (err, result) => {
        if (err) throw err;
        let items = [];
        for (let item of result) {
            let temp = {
                id: item.id,
                productId: item.productId,
                productImageUrl: item.productImageUrl
            };
            items.push(temp);
        }
        res = {
            ...res,
            items
        }
        response.json(res);
    });
})


app.get('/api/categories', (request, response) => {
    let res = {};
    db.query(`
        SELECT count(*) AS count,
        category.id AS id,
        category.name AS name 
        FROM category, product
        WHERE category.id = product.category_id
        GROUP BY category.id;
        `, (err, result) => {
        if (err) throw err;
        let items = [];
        for (let item of result) {
            let temp = {
                count: item.count,
                id: item.id,
                name: item.name
            };
            items.push(temp);
        }
        res = {
            ...res,
            items
        }
        response.json(res);
    });
})

app.listen(3000, () => {
    console.log('connected 3000 port');
});