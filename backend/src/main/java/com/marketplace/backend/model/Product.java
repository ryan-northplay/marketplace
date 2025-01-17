package com.marketplace.backend.model;


import com.marketplace.backend.model.values.BooleanValue;
import com.marketplace.backend.model.values.DoubleValue;
import com.marketplace.backend.model.values.SelectableValue;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@NamedEntityGraph(name = "product-with-all-fields",attributeNodes = {
        @NamedAttributeNode("id"),
        @NamedAttributeNode("name"),
        @NamedAttributeNode("description"),
        @NamedAttributeNode("alias"),
        @NamedAttributeNode("enabled"),
        @NamedAttributeNode("count"),
        @NamedAttributeNode("price"),
        @NamedAttributeNode("rating"),
        @NamedAttributeNode("createdAt"),
        @NamedAttributeNode("modifyDate"),
        @NamedAttributeNode(value = "catalog",subgraph = "catalog-subgraph"),
        @NamedAttributeNode(value = "doubleValues",subgraph = "attribute-subgraph"),
        @NamedAttributeNode(value = "booleanValues",subgraph = "attribute-subgraph"),
        @NamedAttributeNode(value = "selectableValues",subgraph = "attribute-subgraph")
},subgraphs = {
        @NamedSubgraph(name = "catalog-subgraph",attributeNodes = {
                @NamedAttributeNode("alias")
        }),
        @NamedSubgraph(name = "attribute-subgraph",attributeNodes = {
                @NamedAttributeNode("id"),
                @NamedAttributeNode("value"),
                @NamedAttributeNode("attribute")
        })
})

public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;


    @Column(name = "description")
    private String description;

    @Column(name = "alias", nullable = false, unique = true)
    private String alias;

    @Column(name = "enabled",updatable = false,nullable = false)
    private Boolean enabled;

    @Column(name = "count", nullable = false,columnDefinition = "INTEGER, default '0'")
    private Integer count;

    @Column(name = "price",columnDefinition = "DECIMAL(19,2), default '0.00'")
    private BigDecimal price;

    @Column(name = "rating", nullable = false,updatable = false)
    private double rating;

    @CreationTimestamp
    @Column(name = "created_at",updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime modifyDate;
    @ManyToOne
    @JoinColumn(name = "catalog_id",nullable = false)
    private Catalog catalog;


    @OneToMany(mappedBy = "product",fetch = FetchType.LAZY)
    private Set<DoubleValue> doubleValues = new HashSet<>();

    @OneToMany(mappedBy = "product",fetch = FetchType.LAZY)
    private Set<BooleanValue> booleanValues= new HashSet<>();

    @ManyToMany(mappedBy = "products",fetch = FetchType.LAZY)
    private Set<SelectableValue> selectableValues= new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Product product = (Product) o;
        return Objects.equals(id, product.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public void addSelValue(SelectableValue value){
        this.selectableValues.add(value);
        value.getProducts().add(this);
    }


}
