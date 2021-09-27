


redis list 

list.lpush()
list.ltrim() 0 , 1


category_id 
    - address_id  
        - contract1 balance
        - contract1 balance


category_id 
    - address_id  
        - contract1 balance
        - contract1 balance


[{
    ”category_id“:{
        "chain_id":[{
            "address_id":[{
                    "contract":
                     "balance"
            }]

        }]
    }
}]

category_id: '8961f5f7-c0e7-4ac7-a072-e48ba03f354e',
    contract_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    chain_id: 1,
    "category_id":""
    address: '0x4750c43867ef5f89869132eccf19b9b6c4286e1a',
    id: '13360869-d3fc-43be-be4a-d9d2bcc8134f',
    balance: '0',
    updated_at: 2021-09-27T03:30:04.331Z


category_id:chain_id :address:contract_address:balance

    "8961f5f7-c0e7-4ac7-a072-e48ba03f354e":[
        {
            "1":[{
                "0x4750c43867ef5f89869132eccf19b9b6c4286e1a":[{
                    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee":"0"
                }]
            }]
        }
    ]

