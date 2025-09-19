#include <stdio.h> 

int fact(int n);

int main(void){
    int n;
    scanf("%d", &n);
    for(int k = 0; k <= n; k++){
        if (k == n){
            printf("%d", (fact(n) / (fact(k)*fact(n-k))));
        } else {
            printf("%d ", (fact(n) / (fact(k)*fact(n-k))));
        }
    }
}

int fact(int n){
    int c = 1;
    for(int i = 1; i <= n; i++){
        c *= i;
    }
    return c;
}