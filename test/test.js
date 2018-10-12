var Masking = require("../masking.js")
var originalInput = {
    purchase_order_no: "12345",
    budget: "IT DIV",
    user:{
        name: "Arif"
    },
    po_items: [
        {
            sku_no: "SKU123",
            title: "BARANG 1",
            category: {
                name: "MOBIL"
            }
        },
        {
            sku_no: "SKU456",
            title: "BARANG 2",
            category: {
                name: "PINTU"
            }
        }
    ],
    shipping:[
        {
            address: "alamat 1"
        },
        {
            address: "alamat 2"
        }
    ]
} 

var formatJson = '{ \
        "po" : { \
            "purchase_order_no" : "po_number", \
            "po_items": { \
                "sku_no" : "barang.sku_number", \
                "title" : "barang.name", \
                "category.name": "barang.category_name", \
                "budget": "barang.budget_name", \
                "user.name": "barang.requestor" \
            }, \
            "shipping" : { \
                "address" : "pengiriman.alamat" \
            }, \
            "shipping.1.address" : "spesific_address" \
        } \
    }'
var hasil = new Masking({input: originalInput, masking: formatJson})
                .generate("po")
console.log(hasil)