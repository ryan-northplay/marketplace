package com.marketplace.backend.service;

import com.marketplace.backend.dao.ManageProductDao;
import com.marketplace.backend.dto.product.ProductConverters;
import com.marketplace.backend.dto.product.request.RequestSaveProductDto;
import com.marketplace.backend.model.Catalog;
import com.marketplace.backend.model.Product;
import com.marketplace.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;

@Service
public class ManageProductService implements ManageProductDao {
    private final ProductRepository productRepository;
    @PersistenceContext
    private final EntityManager entityManager;
    private final CatalogService catalogService;
    private final ProductConverters productConverters;

    @Autowired
    public ManageProductService(ProductRepository productRepository, EntityManager entityManager, CatalogService catalogService, ProductConverters productConverters) {
        this.productRepository = productRepository;
        this.entityManager = entityManager;
        this.catalogService = catalogService;
        this.productConverters = productConverters;
    }

    @Override
    public void save(Product product) {
        productRepository.save(product);
    }

    @Override
    public void delete(String alias) {
        Query query = entityManager
                .createQuery("UPDATE Product as p set p.enabled=false where p.alias=:alias");
        query.setParameter("alias", alias);
        query.executeUpdate();
    }

    @Override
    @Transactional
    public Product save(RequestSaveProductDto dto) {
        Catalog catalog = catalogService.findEntityByAlias(dto.getCatalogAlias());
        Product product = productConverters.requestSaveProductDtoToProduct(dto, catalog);
        productRepository.save(product);
        return product;
    }
}
