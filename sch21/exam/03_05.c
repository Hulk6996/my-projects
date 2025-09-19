#include <stdio.h>

int main(void){
    int x,y,z;
    int cnt;
    char lastchar;
    cnt = scanf("%d %d %d", &x, &y, &z);
    lastchar = getchar();
    if(cnt != 3 || lastchar != 0x0a){
        printf("n/a");
        return 0;
    }
    if(x == 1 && (z || y) == 1){
        printf("1");
    } else if(x == 0 && (z || y) == 0) 
    {
        printf("0");
    } else (printf("n/a"));
}