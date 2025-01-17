package com.marketplace.backend.mappers;

import com.marketplace.backend.dto.catalog.request.RequestSaveCatalogDto;
import com.marketplace.backend.dto.catalog.request.RequestUpdateCatalogDto;
import com.marketplace.backend.dto.catalog.response.ResponseAttributeByCatalogAlias;
import com.marketplace.backend.dto.catalog.response.ResponseSimpleCatalogDto;
import com.marketplace.backend.dto.catalog.response.ResponseSingleAfterSaveCatalogDto;
import com.marketplace.backend.dto.catalog.response.single.ResponseSingleCatalogDto;
import com.marketplace.backend.model.Attribute;
import com.marketplace.backend.model.Catalog;
import com.marketplace.backend.model.values.SelectableValue;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface CatalogMapper {

    ResponseSingleCatalogDto entityToSingleCatalogDto(Catalog catalog);

    Catalog dtoToEntity(RequestSaveCatalogDto dto);
    Catalog dtoToEntity(RequestUpdateCatalogDto dto);

    default ResponseSingleCatalogDto.SelectAttributeDto entitySelectableValuesToDto(List<SelectableValue> entityList, Attribute attribute){
        ResponseSingleCatalogDto.SelectAttributeDto dto = new ResponseSingleCatalogDto.SelectAttributeDto();
        dto.setId(attribute.getId());
        dto.setName(attribute.getName());
        dto.setAlias(attribute.getAlias());
        if(entityList==null||entityList.isEmpty()){
            dto.setValues(null);
            return dto;
        }
        Set<ResponseSingleCatalogDto.SelectValueDto> valueDtoList = entityList.stream().map(this::singleEntitySelectableValueToDto).collect(Collectors.toSet());
        dto.setValues(valueDtoList);
        return dto;
    }
    ResponseSingleCatalogDto.SelectValueDto singleEntitySelectableValueToDto(SelectableValue entity);
    ResponseSimpleCatalogDto entityToSimpleCatalogDto(Catalog catalog);

    ResponseAttributeByCatalogAlias entityToAttributesDto(Catalog catalog);

    Set<ResponseAttributeByCatalogAlias.NumberAttributeDto> numericAttributesToDto(Set<Attribute> numAttributeList);

    @Mapping(source = "alias",target = "attributeAlias")
    ResponseAttributeByCatalogAlias.NumberAttributeDto numericAttributeToDto(Attribute numAttribute);
    default Set<ResponseAttributeByCatalogAlias.SelectAttributeDto> selectableAttributesToDto(Set<Attribute> selAttributeList){
        if ( selAttributeList == null ) {
            return null;
        }
        Set<ResponseAttributeByCatalogAlias.SelectAttributeDto> set = new LinkedHashSet<>(Math.max((int) (selAttributeList.size() / .75f) + 1, 16));
        for ( Attribute attribute : selAttributeList ) {
            ResponseAttributeByCatalogAlias.SelectAttributeDto attributeDto = attributeToSelectAttributeDto( attribute );
            attributeDto.setValues(singleAttributeValuesToDto(attribute.getSingleSelectableValue()));
            set.add( attributeDto );
        }

        return set;
    }
   /* @Mapping(source = "alias",target = "attributeAlias")*/
    ResponseAttributeByCatalogAlias.SelectAttributeDto attributeToSelectAttributeDto(Attribute attribute);

    Set<ResponseAttributeByCatalogAlias.SelectValueDto> singleAttributeValuesToDto(Set<SelectableValue> entities);
    default ResponseSingleAfterSaveCatalogDto entityToAfterSaveDto(Catalog catalog,List<Attribute> selAttributeList,List<Attribute> numAttributeList){
        ResponseSingleAfterSaveCatalogDto dto = new ResponseSingleAfterSaveCatalogDto();
        dto.setId(catalog.getId());
        dto.setAlias(catalog.getAlias());
        dto.setName(catalog.getName());
        dto.setImage(catalog.getImage());
        dto.setEnabled(catalog.isEnabled());
        dto.setCreatedAt(catalog.getCreatedAt());
        dto.setModifyDate(catalog.getModifyDate());
        if (selAttributeList==null||selAttributeList.isEmpty()){
            dto.setSelectAttribute(null);
        }else {
            Set<ResponseSingleAfterSaveCatalogDto.SelectAttributeDto> selectAttributeDtos = new HashSet<>();
            selAttributeList.forEach(x->{
                ResponseSingleAfterSaveCatalogDto.SelectAttributeDto selDto = new ResponseSingleAfterSaveCatalogDto.SelectAttributeDto();
                selDto.setAlias(x.getAlias());
                selDto.setId(x.getId());
                selDto.setName(x.getName());
                Set<ResponseSingleAfterSaveCatalogDto.SelectValueDto> selectValueDtoSet = new HashSet<>(x.getSingleSelectableValue().size());
                x.getSingleSelectableValue().forEach(y-> {
                    ResponseSingleAfterSaveCatalogDto.SelectValueDto  selectValueDto = new ResponseSingleAfterSaveCatalogDto.SelectValueDto(y.getId(), y.getValue());
                    selectValueDtoSet.add(selectValueDto);
                });
                selDto.setValues(selectValueDtoSet);
                selectAttributeDtos.add(selDto);
            });
            dto.setSelectAttribute(selectAttributeDtos);
        }
        if(numAttributeList==null||numAttributeList.isEmpty()){
            dto.setNumberAttribute(null);
        }else {
            Set<ResponseSingleAfterSaveCatalogDto.NumberAttributeDto> numberAttributeDtos =
                    numAttributeList.stream().map(x->new ResponseSingleAfterSaveCatalogDto.
                            NumberAttributeDto(x.getId(),x.getName(),x.getAlias())).collect(Collectors.toUnmodifiableSet());
            dto.setNumberAttribute(numberAttributeDtos);
        }
        return dto;
    }
}
