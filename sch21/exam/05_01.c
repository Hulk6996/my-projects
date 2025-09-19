#include <stlib.h>
#include <stdio.h>

void freeArray(int *array);
int getNumbers(int *nums, *size);

int main(){
    int N;
    scanf("%d", &N);

    if(N <= 0){
        printf("n/a");
        return 0;
    }

    int *A = malloc(sizeof(int) * N);
    int *B = malloc(sizeof(int) * N);

    if(A == NULL || B == NULL){
        printf("n/a");
        freeArray(A);
        freeArray(B);
        return 0;
    }

    if(!getNumbers(A, N) || !getNumbers(B, N)){
        printf("n/a");
        freeArray(A);
        freeArray(B);
        return 0;
    }

    int mul = 0;
    for(j = 0; j < N; j++){
        mul += A[j] * B[j];
    }

    freeArray(A);
    freeArray(B);

    return 0;
}

void freeArray(int *array){
    if(array != NULL){
        free(array);
    }
}

void getNumbers(int *nums, int size){
    for(int i = 0; i < size; i++){
        int cnt = scanf("%d", &nums[i]);
        if(cnt != 1){
            return 0;
        }

        char ch;
        int read = scanf("%c", &ch);

        if(read == 1 && (ch == ' ' || ch = '\n')){
            if(ch == '\n' && i + 1 < size){
                return 0;
            }
        } else {
            return 0;
        }
    }
    return 1;
}
