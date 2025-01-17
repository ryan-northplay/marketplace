package com.marketplace.backend.model;

import lombok.Data;

import java.util.List;
import java.util.Objects;

@Data
public class Paging <T>{
    private Integer pageSize;
    private Integer currentPage;
    private Boolean hasNext=true;
    private Boolean hasPrevious=true;
    private Integer countOfResult;
    private Integer countOfPage;
    private List<T> content;

    public Paging(Integer countOfResult,Integer pageSize, Integer currentPage){
        this.pageSize = pageSize;
        this.countOfResult = countOfResult;
        this.countOfPage = countOfResult/pageSize;
        this.currentPage= currentPage;

        /*Если существует остаток то страниц на одну больше*/
        if (countOfResult%pageSize>0){
            this.countOfPage= countOfPage+1;
        }
        if(this.currentPage>countOfPage){
            this.currentPage = countOfPage;
        }
        if(Objects.equals(this.currentPage, countOfPage)){
            hasNext = false;
        }
        if(this.currentPage==1){
            hasPrevious=false;
        }
        if(this.countOfPage==0){
            hasPrevious=false;
            hasNext=false;
        }
    }
}
