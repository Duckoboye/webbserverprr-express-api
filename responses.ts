// Create a standard response structure.
export interface ApiResponse<T> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
}

// Create a helper function to generate success responses.
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
    return {
        status: 'success',
        data,
    };
}

// Create a helper function to generate error responses.
export function createErrorResponse(message: string): ApiResponse<null> {
    return {
        status: 'error',
        message,
    };
}
