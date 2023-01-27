package com.marketplace.backend.service;


import com.marketplace.backend.dto.catalog.request.RequestSaveCatalogDto;
import com.marketplace.backend.dto.catalog.response.ResponseSimpleCatalogDto;
import com.marketplace.backend.dto.catalog.response.single.NumberAttributeDto;
import com.marketplace.backend.exception.OperationNotAllowedException;
import com.marketplace.backend.exception.ResourceNotFoundException;
import com.marketplace.backend.mappers.CatalogMapper;
import com.marketplace.backend.model.Attribute;
import com.marketplace.backend.model.Catalog;
import com.marketplace.backend.model.Paging;
import com.marketplace.backend.model.values.SelectableValue;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CatalogService {
    private final CatalogMapper mapper;
    private final AttributeValueService attributeValueService;
    private final AttributeService attributeService;

    @PersistenceContext
    private final EntityManager entityManager;

    @Autowired
    public CatalogService(AttributeValueService attributeValueService, AttributeService attributeService, EntityManager entityManager) {
        this.attributeValueService = attributeValueService;
        this.attributeService = attributeService;
        this.entityManager = entityManager;
        this.mapper = Mappers.getMapper(CatalogMapper.class);
    }


    @Transactional
    public Catalog saveOrUpdate(RequestSaveCatalogDto dto) {
        if(dto.getId()==null){
            return saveNewEntity(dto);
        }
        return updateEntity(dto);
    }

    @Transactional
    public Catalog saveNewEntity(RequestSaveCatalogDto dto){
        Catalog catalog = mapper.dtoToEntity(dto);
        Set<Attribute> attributeList = attributeService.getListAttributeByAliases(dto.getAttributeAlias());
        catalog.setAttributes(attributeList);
        attributeList.forEach(x->x.getCatalog().add(catalog));
        entityManager.persist(catalog);
        entityManager.flush();
        return catalog;
    }
    @Transactional
    public Catalog updateEntity(RequestSaveCatalogDto dto){
        Set<Attribute> newAttributes = attributeService.getListAttributeByAliases(dto.getAttributeAlias());
        Query updateQuery = entityManager
                .createQuery("UPDATE Catalog as c set c.alias = :alias,c.name = :name,c.enabled=true ,c.image = :image where c.id=:id");
        updateQuery.setParameter("alias",dto.getAlias());
        updateQuery.setParameter("name",dto.getName());
        updateQuery.setParameter("image",dto.getImage());
        updateQuery.setParameter("id",dto.getId());
        updateQuery.executeUpdate();
        Catalog catalog = entityManager.find(Catalog.class,dto.getId());
        Set<Attribute> oldAttributes = catalog.getAttributes();
        Set<Attribute> attributesForDelete = oldAttributes.stream().filter(x->!newAttributes.contains(x)).collect(Collectors.toSet());
        Set<Attribute> attributesForAdd = newAttributes.stream().filter(x->!oldAttributes.contains(x)).collect(Collectors.toSet());
        for(Attribute attribute: attributesForDelete){
            catalog.removeAttribute(attribute);
        }
        for(Attribute attribute: attributesForAdd){
            catalog.addAttribute(attribute);
        }
        return catalog;
    }
    public Catalog findCatalogByAliasWithFullAttributes(String alias){
        TypedQuery<Catalog> catalogQuery =
                entityManager.
                        createQuery("SELECT c from Catalog as c where c.alias=:alias",Catalog.class);
        catalogQuery.setParameter("alias",alias);
        EntityGraph<?> entityGraph = entityManager.getEntityGraph("catalog-with-full-attributes");
        catalogQuery.setHint("javax.persistence.fetchgraph", entityGraph);
        return catalogQuery.getResultStream()
                .findFirst().orElseThrow(()->new ResourceNotFoundException("Не найден каталог с псевдонимом "+alias));
    }

    public Set<NumberAttributeDto> findNumberAttributesInCatalog (Catalog catalog){
        return attributeValueService.findNumberAttributesInCatalog(catalog.getId());
    }

    public Set<SelectableValue> findSelectableAttributesInCatalog(Catalog catalog){
        return attributeValueService.findSelectableAttributesInCatalog(catalog.getId());
    }

    @Transactional
    public Paging<ResponseSimpleCatalogDto> getAll(Integer page, Integer pageSize) {
       TypedQuery<Long> countQuery = entityManager.createQuery("select count (c) from Catalog as c where c.enabled=true", Long.class);
       Integer count = Math.toIntExact(countQuery.getSingleResult());
       TypedQuery<Catalog> resultQuery = entityManager.createQuery("select c from Catalog  as c where c.enabled=true", Catalog.class);
       Paging<ResponseSimpleCatalogDto> result = new Paging<>(count,pageSize,page);
       result.setContent(resultQuery.getResultStream()
               .map(mapper::entityToSimpleCatalogDto).collect(Collectors.toList()));
       return result;
    }

    @Transactional
    public void delete(String alias) {
        TypedQuery<Long> query = entityManager.createQuery("Select count (p.products) from Catalog as p where p.alias=:alias", Long.class);
        query.setParameter("alias",alias);
        int count = Math.toIntExact(query.getSingleResult());
        if(count>0){
            throw  new OperationNotAllowedException("Каталог содержит продукты удаление невозможно");
        }
        Query queryDelete = entityManager.createQuery("UPDATE Catalog as c set c.enabled = false where c.alias=:alias");
        queryDelete.setParameter("alias",alias);
        queryDelete.executeUpdate();
    }


    public Catalog findEntityByAlias(String catalogAlias) {
        TypedQuery<Catalog> resultQuery = entityManager.createQuery("select c from Catalog  as c where c.enabled=true and c.alias=:alias", Catalog.class);
        resultQuery.setParameter("alias",catalogAlias);
        Optional<Catalog> optionalCatalog = resultQuery.getResultStream().findFirst();
        if(optionalCatalog.isPresent()){
            return optionalCatalog.get();
        }
        throw new ResourceNotFoundException("Не найден каталог с псевдонимом: "+catalogAlias);
    }
}
