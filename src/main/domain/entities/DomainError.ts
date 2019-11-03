export class DomainError {

    constructor(
        readonly message: string,
        readonly status: number = 500
    ) {

    }

}