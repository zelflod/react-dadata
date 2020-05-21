import Highlighter from 'react-highlight-words';
import React, { FC } from 'react';
import { BaseProps, BaseSuggestions } from './BaseSuggestions';
import { DaDataParty, DaDataPartyStatus, DaDataPartyType, DaDataSuggestion } from './types';

type Dictionary = { [key: string]: any };

interface Props extends BaseProps<DaDataParty> {
  filterStatus?: DaDataPartyStatus[];
  filterType?: DaDataPartyType;
  filterLocations?: Dictionary[];
  filterLocationsBoost?: Dictionary[];
}

export class InternalPartySuggestions extends BaseSuggestions<DaDataParty, Props> {
  loadSuggestionsUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party';

  getLoadSuggestionsData = () => {
    const { count, filterStatus, filterType, filterLocations, filterLocationsBoost } = this.props;
    const { query } = this.state;

    const requestPayload: any = {
      query,
      count: count || 10,
    };

    // Ограничение по статусу организации
    if (filterStatus) {
      requestPayload.status = filterStatus;
    }

    // Ограничение по типу организации
    if (filterType) {
      requestPayload.type = filterType;
    }

    // Сужение области поиска
    if (filterLocations) {
      requestPayload.locations = filterLocations;
    }

    // Приоритет города при ранжировании
    if (filterLocationsBoost) {
      requestPayload.locations_boost = filterLocationsBoost;
    }

    return requestPayload;
  }

  protected renderOption = (suggestion: DaDataSuggestion<DaDataParty>) => {
    const { renderOption, highlightClassName } = this.props;

    return renderOption ? renderOption(suggestion) : (
      <div>
        <Highlighter
          highlightClassName={highlightClassName || 'react-dadata--highlighted'}
          autoEscape
          searchWords={this.getHighlightWords()}
          textToHighlight={suggestion.value}
        />
        <div className="react-dadata__suggestion-subtitle">
          {suggestion.data.inn && (
            <div className="react-dadata__suggestion-subtitle-item">
              {suggestion.data.inn}
            </div>
          )}
          {suggestion.data.address && suggestion.data.address.value && (
            <div className="react-dadata__suggestion-subtitle-item">
              <Highlighter
                highlightClassName={highlightClassName || 'react-dadata--highlighted'}
                autoEscape
                searchWords={this.getHighlightWords()}
                textToHighlight={suggestion.data.address.value}
              />
            </div>
          )}
        </div>
      </div>
    );
  };
}

export const PartySuggestions: FC<Props> = (props) => {
  const getSuggestionKey = (suggestion: DaDataSuggestion<DaDataParty>): string => `${suggestion.data.inn}`;
  return (
    <InternalPartySuggestions
      getSuggestionKey={getSuggestionKey}
      {...props}
    />
  )
};
