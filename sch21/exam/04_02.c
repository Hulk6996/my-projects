#include <stdio.h>

int fact(int n);

int main(void){
    long int n = 0;
    int max = 0;
    
    while(n != -1){
        if (scanf("%ld", &n) != 1){
            printf("n/a");
            return 0;
        };
        if(n >+ max){
            max = n;
        }
    }
    printf("%d", max);    
}



/* #include <stdio.h>

int main(void) {
    long int n;
    int max = 0;

    do {
        if (scanf("%ld", &n) != 1) {
            printf("n/a");
            return 0;
        }
        
        if (n != -1 && n >= max) {
            max = n;
        }
    } while (n != -1);

    printf("%d", max);

    return 0;
}
 */