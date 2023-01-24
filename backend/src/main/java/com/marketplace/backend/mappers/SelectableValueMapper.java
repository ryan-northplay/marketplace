package com.marketplace.backend.mappers;

import com.marketplace.backend.dto.attributes.response.SelectableValueDto;
import com.marketplace.backend.model.values.SelectableValue;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper
public interface SelectableValueMapper {

    List<SelectableValue> dtoListToEntityList(List<SelectableValueDto> dtoList);
    SelectableValue dtoToEntity(SelectableValueDto dto);
    @Mapping(target = "attributeId",source = "attribute.id")
    SelectableValueDto entityToDto(SelectableValue selectableValue);
    List<SelectableValueDto> entityListToDtoList(List<SelectableValue> values);
}