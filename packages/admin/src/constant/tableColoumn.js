export const clientColumn=[
    {title:"No",dataIndex:"no",},
    {title:"First Name",dataIndex:"firstName",sorter: (a, b) => a.firstName.localeCompare(b.firstName),},
    {title:"Last Name",dataIndex:'lastName',sorter: (a, b) => a.lastName.localeCompare(b.lastName)},
    {title:"Email",dataIndex:'email'},
    {title:"Address",dataIndex:'address'}
]

