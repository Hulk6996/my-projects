#include <stdio.h>
#define MAX_ELEMENTS 10

int readInput(int* array, int* size);
void printOutput(int* array, int size);
int findMax(int* array, int size);
int findMin(int* array, int size);
double calculateMean(int* array, int size);
double calculateVariance(int* array, int size, double mean);
double calculatePower(double base, int exponent);

void printResult(int max_value, int min_value, double mean_value, double variance_value);

int main() {
    int size, data[MAX_ELEMENTS];
    if (!readInput(data, &size)) return 0;
    printOutput(data, size);
    printf("\n");
    printResult(findMax(data, size), findMin(data, size), calculateMean(data, size), calculateVariance(data, size, calculateMean(data, size)));
    return 1;
}

double calculatePower(double base, int exponent) {
    double result = 1;
    for (int i = 0; i < exponent; i++) {
        result *= base;
    }
    return result;
}

int readInput(int* array, int* size) {
    if (scanf("%d", size) != 1 || *size > MAX_ELEMENTS || *size <= 0) {
        printf("n/a");
        return 0;
    }
    for (int* p = array; p - array < *size; p++) {
        scanf("%d", p);
    }
    return 1;
}

void printOutput(int* array, int size) {
    for (int i = 0; i < size; i++) {
        printf("%d", array[i]);
        if (i != size - 1) printf(" ");
    }
}

int findMin(int* array, int size) {
    int min_value = *array;
    for (int i = 0; i < size; i++) {
        if (array[i] < min_value) min_value = array[i];
    }
    return min_value;
}

int findMax(int* array, int size) {
    int max_value = *array;
    for (int i = 0; i < size; i++) {
        if (array[i] > max_value) max_value = array[i];
    }
    return max_value;
}

double calculateMean(int* array, int size) {
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += array[i];
    }
    return sum / (double)size;
}

double calculateVariance(int* array, int size, double mean) {
    double sum = 0;
    for (int i = 0; i < size; i++) {
        sum += calculatePower((array[i] - mean), 2);
    }
    return sum / (double)size;
}

void printResult(int max_value, int min_value, double mean_value, double variance_value) {
    printf("%d %d %lf %lf", max_value, min_value, mean_value, variance_value);
}
