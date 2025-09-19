#include <stdio.h>

int main(void){
    double rad;
    double deg;
    int cnt;
    int chr;
    cnt = scanf("%lf", &rad);
    chr = getchar();
    if(rad < 0 || cnt != 1 || chr != 0x0a){
        printf("n/a");
        return 0;
    }
    deg = rad * 57.29;
    printf("%.0lf", deg);
}