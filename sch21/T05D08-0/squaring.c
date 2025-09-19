#include <stdio.h>
#define MAX_SIZE 10

int readArray(int* arr, int* size);
void printArray(int* arr, int size);
void squareElements(int* arr, int size);

int main() {
    int size, elements[MAX_SIZE];
    if (!readArray(elements, &size)) return 0;
    squareElements(elements, size);
    printArray(elements, size);
    return 0;
}

int readArray(int * arr, int* size) {
    if (scanf("%d", size) != 1 || *size > MAX_SIZE || *size <= 0) {
        printf("n/a");
        return 0;
    }
    for (int* p = arr; p - arr < *size; p++) {
        if (scanf("%d", p) != 1) {
            printf("n/a");
            return 0;
        }
    }
    return 1;
}

void printArray(int* arr, int size) {
    for (int i = 0; i < size; i++) {
        printf("%d", arr[i]);
        if (i != size - 1) printf(" ");
    }
}

void squareElements(int* arr, int size) {
    for (int i = 0; i < size; i++) {
        arr[i] *= arr[i];
    }
}
