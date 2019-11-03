const retry = async function<T>(promise: () => Promise<T>, retries: number = 5): Promise<T> {
    try {
        return promise();
    } catch (error) {
        if (retries > 0) {
            return retry(promise, retries - 1);
        }
        else {
            throw error;
        }
    }
}

export default retry;