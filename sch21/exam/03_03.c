#include <stdio.h>
#include <math.h>

int main(void){
    float x;
    int c;
    int a,s,d;
    char lastchar;
    int cnt;
    int minus = 0;
    cnt = scanf("%f", &x);
    lastchar = getchar();
    if(x < 0){
        minus = 1;
    }
    x = fabs(x);
    if(cnt != 1 && lastchar != 0x0a){
        printf("n/a");
        return 0;
    }
    c = x;
    a = c % 10;
    c = c / 10;
    s = c % 10;
    d = c / 10;
    if(minus == 1){
        printf("-%d%d%d", a, s, d);
    } else {
        printf("%d%d%d", a, s, d);
    }
}