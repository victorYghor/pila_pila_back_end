class Expense {
    constructor(
        id: string,
        amount: number,
        description: string,
        tag: ExpenseTag,
        date: Date,
        essential: boolean,
        recurrent: boolean,
    ) { }
}

enum ExpenseTag {
    SERVICOS = "SERVICOS",
    MORADIA = 'MORADIA',
    ALIMENTACAO = "ALIMENTACAO",
    EDUCACAO = "EDUCACAO",
    SUPERMERCADO = "SUPERMERCADO",
    SAUDE = "SAUDE",
    LAZER = "LAZER",
    OUTROS = "OUTROS",
}
