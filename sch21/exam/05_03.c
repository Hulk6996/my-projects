#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr = malloc(1000 * sizeof(int));
    int i = 0;

    while(scanf("%d", &arr[i])){
        i++;
        if(arr[i - 1] == - 1){
            break;
        }
    }
    
    int n = i - 1;
    int x = getchar();
    if(x == '\n' || x == '\0' || x == EOF) {
        if(n % 2 == 0){
            for(int j = 0; j < n / 2; j++){
                printf("%d ", arr[j]);
                printf("%d ", arr[n - 1 - j]);
            }
        } else {
            for(int j = 0; j < n / 2; j++){
                printf("%d ", arr[j]);
                printf("%d ", arr[n - 1 -j]);
            }
            printf("%d ", arr[n / 2]);
        }
    } else {
        printf("n/a");
    }
    free(arr);
    return 0;
}