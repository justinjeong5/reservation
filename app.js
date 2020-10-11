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

app.get('/detail', (request, response) => {
    response.render('detail.html');
})

app.get('/api/products/:id', (request, response) => {
    let res = {};
    db.query(`
    SELECT 
    product.id AS productID,
    product.description AS productDescription,
    product.content AS productContent,
    product.event AS productEvent,
    category.id AS categoryId,
    category.name AS categoryName,
    display_info.id AS displayInfoId,
    display_info.opening_hours AS openingHours,
    display_info.place_name AS placeName,
    display_info.place_lot AS placeLot,
    display_info.place_street AS placeStreet,
    display_info.tel AS telephone,
    display_info.homepage AS homepage,
    display_info.email AS email,
    display_info.create_date AS createDate,
    display_info.modify_date AS modifyDate
    FROM product 
    INNER JOIN category ON product.category_id = category.id
    INNER JOIN display_info ON product.id = display_info.product_id
    WHERE product.id = ?
    `, [parseInt(request.params.id)], (err, result) => {
        if (err) throw err;
        const displayInfo = {
            productID: result[0].productID,
            productDescription: result[0].productDescription,
            productContent: result[0].productContent,
            productEvent: result[0].productEvent,
            categoryId: result[0].categoryId,
            categoryName: result[0].categoryName,
            displayInfoId: result[0].displayInfoId,
            openingHours: result[0].openingHours,
            placeName: result[0].placeName,
            placeLot: result[0].placeLot,
            placeStreet: result[0].placeStreet,
            telephone: result[0].telephone,
            homepage: result[0].homepage,
            email: result[0].email,
            createDate: result[0].createDate,
            modifyDate: result[0].modifyDate
        }
        res = { displayInfo }

        db.query(`
        SELECT
        product.id AS productID,
        product_image.id AS productImageId,
        product_image.type AS type,
        file_info.id AS fileInfoId,
        file_info.file_name AS fileName,
        file_info.save_file_name AS saveFileName,
        file_info.content_type AS contentType,
        file_info.delete_flag AS deleteFlag,
        file_info.create_date AS createDate,
        file_info.modify_date AS modifyDate
        FROM product
        INNER JOIN product_image ON product.id = product_image.product_id
        INNER JOIN file_info ON product_image.file_id = file_info.id
        WHERE product.id = ?;
        `, [parseInt(request.params.id)], (err2, result2) => {
            if (err2) throw err2;
            const productImages = [];
            for (const item of result2) {
                const temp = {
                    productID: item.productID,
                    productImageId: item.productImageId,
                    type: item.type,
                    fileInfoId: item.fileInfoId,
                    fileName: item.fileName,
                    saveFileName: item.saveFileName,
                    contentType: item.contentType,
                    deleteFlag: item.deleteFlag,
                    createDate: item.createDate,
                    modifyDate: item.modifyDate
                };
                productImages.push(temp);
            }
            res = {
                ...res,
                productImages
            }
            db.query(`
            SELECT
            display_info.id AS displayInfoId,
            display_info_image.id AS displayInfoImageId,
            file_info.id AS fileId,
            file_info.file_name AS fileName,
            file_info.save_file_name AS saveFileName,
            file_info.content_type AS contentType,
            file_info.delete_flag AS deleteFlag,
            file_info.create_Date AS createDate,
            file_info.modify_date AS modifyDate
            FROM product
            INNER JOIN display_info ON  product.id = display_info.product_id
            INNER JOIN display_info_image ON display_info.id = display_info_image.display_info_id
            INNER JOIN file_info ON display_info_image.file_id = file_info.id
            WHERE product.id = 1;
            `, [request.params.id], (err3, result3) => {
                if (err3) throw err3;
                const displayInfoImage = {
                    displayInfoId: result3[0].displayInfoId,
                    displayInfoImageId: result3[0].displayInfoImageId,
                    fileId: result3[0].fileId,
                    fileName: result3[0].fileName,
                    saveFileName: result3[0].saveFileName,
                    contentType: result3[0].contentType,
                    deleteFlag: result3[0].deleteFlag,
                    createDate: result3[0].createDate,
                    modifyDate: result3[0].modifyDate
                }
                res = {
                    ...res,
                    displayInfoImage
                }
                db.query(`
                SELECT *
                FROM (SELECT 
                    product.id AS productId,
                    reservation_info.reservation_name AS reservationName,
                    reservation_info.reservation_tel AS reservationTelephone,
                    reservation_info.reservation_email AS reservationEmail,
                    reservation_info.reservation_date AS reservationDate,
                    reservation_user_comment.id AS commentId,
                    reservation_user_comment.reservation_info_id AS reservationInfoId,
                    reservation_user_comment.score AS score,
                    reservation_user_comment.comment AS comment,
                    reservation_user_comment.create_date AS productCreateDate,
                    reservation_user_comment.modify_date AS productModifyDate
                    FROM product
                    INNER JOIN reservation_info ON product.id = reservation_info.product_id
                    INNER JOIN reservation_user_comment ON reservation_info.id = reservation_user_comment.reservation_info_id
                    WHERE product.id = ?) AS a
                    LEFT OUTER JOIN (SELECT 
                        reservation_user_comment_image.reservation_user_comment_id AS imageId,
                        file_info.id AS fileId,
                        file_info.file_name AS fileName,
                        file_info.save_file_name AS saveFileName,
                        file_info.content_type AS contentType,
                        file_info.delete_flag AS deleteFlag,
                        file_info.create_date AS createDate,
                        file_info.modify_date AS modifyDate
                        FROM file_info
                        INNER JOIN reservation_user_comment_image ON file_info.id = reservation_user_comment_image.file_id) AS b ON a.commentId = b.imageId;
                `, [parseInt(request.params.id)], (err4, result4) => {
                    if (err4) throw err4;
                    const comments = [];
                    if (result4[0] !== undefined) {
                        let prevCommentId = result4[0].commentId;
                        for (const item of result4) {
                            const comment = {
                                commentId: item.commentId,
                                productId: item.productId,
                                reservationInfoId: item.reservationInfoId,
                                score: item.score,
                                comment: item.comment,
                                reservationName: item.reservationName,
                                reservationTelephone: item.reservationTelephone,
                                reservationEmail: item.reservationEmail,
                                reservationDate: item.reservationDate,
                                createDate: item.productCreateDate,
                                modifyDate: item.productModifyDate,
                                commentImages: []
                            };
                            const commentImage = {
                                imageId: item.imageId,
                                reservationInfoId: item.reservationInfoId,
                                reservationUserCommentId: item.reservationUserCommentId,
                                fileId: item.fileId,
                                fileName: item.fileName,
                                saveFileName: item.saveFileName,
                                contentType: item.contentType,
                                deleteFlag: item.deleteFlag,
                                createDate: item.createDate,
                                modifyDate: item.modifyDate
                            };
                            if (item.imageId !== null) {
                                comment.commentImages.push(commentImage);
                            }
                            if (comments.length > 0) {
                                if (prevCommentId !== item.commentId) {
                                    prevCommentId = item.commentId;
                                } else {
                                    comments[comments.length - 1].commentImages.push(commentImage);
                                    continue;
                                }
                            }
                            comments.push(comment);
                        }
                    }
                    res = {
                        ...res,
                        comments
                    }
                    db.query(`
                    SELECT avg(score) AS averageScore
                    FROM reservation_user_comment
                    WHERE reservation_user_comment.product_id = ?;
                    `, [parseInt(request.params.id)], (err5, result5) => {
                        if (err5) throw err5;
                        res = {
                            ...res,
                            averageScore: result5[0].averageScore
                        }
                        db.query(`
                        SELECT 
                        id AS productPriceId,
                        product_id AS productId,
                        price_type_name AS priceTypeName,
                        price AS price,
                        discount_rate AS discountRate,
                        create_date AS createDate,
                        modify_date AS modifyDate
                        FROM product_price
                        WHERE product_id = ?;
                        `, [parseInt(request.params.id)], (err6, result6) => {
                            const productPrices = [];
                            for (const item of result6) {
                                const temp = {
                                    productPriceId: item.productPriceId,
                                    productId: item.productId,
                                    priceTypeName: item.priceTypeName,
                                    price: item.price,
                                    discountRate: item.discountRate,
                                    createDate: item.createDate,
                                    modifyDate: item.modifyDate
                                }
                                productPrices.push(temp);
                            }
                            res = {
                                ...res,
                                productPrices
                            }
                            response.json(res);
                        });
                    });
                });
            });
        });
    });
})

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
        product.content AS productContent,
        product.description AS productDescription,
        file_info.save_file_name AS productImageUrl,
        display_info.place_name AS placeName
        FROM promotion
        INNER JOIN product ON promotion.product_id = product.id
        INNER JOIN product_image ON product.id = product_image.product_id
        INNER JOIN file_info ON product_image.file_id = file_info.id
        INNER JOIN display_info ON product.id = display_info.product_id
        WHERE product_image.type='th';
        `, (err, result) => {
        if (err) throw err;
        let items = [];
        for (let item of result) {
            let temp = {
                promotionId: item.id,
                productId: item.productId,
                productImageUrl: item.productImageUrl,
                productDescription: item.productDescription,
                productContent: item.productContent,
                placeName: item.placeName
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