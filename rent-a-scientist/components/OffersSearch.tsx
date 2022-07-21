import { useQuery } from "@apollo/client";
import { Button, Input, TextField } from "@material-ui/core";
import { FC, useCallback, useMemo, useState } from "react";
import { collectSchoolSubjects, doRegionsMatch, filterOffer } from "../helpers/offerhelp";
import { shuffleSlices } from "../helpers/shuffle";
import { QUERY_RSA_CONFIG, RSAConfig } from "../queries/ras_config";
import { ALL_OFFERS } from "../queries/ras_offer";
import { AllSchols_School } from "../queries/__generated__/AllSchols";
import { AllScientistOffers, AllScientistOffers_ScientistOffer } from "../queries/__generated__/AllScientistOffers";
import { QueryRSAConfig } from "../queries/__generated__/QueryRSAConfig";
import { CategorySelector } from "./CategorySelector";
import { GradeSelector } from "./GradeSelector";
import { OfferDisplay } from "./OfferDisplay";
import { RegistrationSelection } from "./RegistrationSelection";
import { SchoolSelector } from "./SchoolSelector";

interface IProps {
  className?: string
}

// Maps from the id of a selected offer to the days selected in it
type SelectedOffers = Record<number, number[]>;


export const OffersSearch: FC<IProps> = ({
  className
}) => {

  const qConfig = useQuery<QueryRSAConfig>(QUERY_RSA_CONFIG);

  const rsaConfig = useMemo(() => {
    const pid = qConfig?.data?.RentAScientistConfig_by_pk?.program_id || -1;
    const lstart = qConfig?.data?.RentAScientistConfig_by_pk?.Program.lectureStart;
    const lend = qConfig?.data?.RentAScientistConfig_by_pk?.Program.lectureEnd;
    const result: RSAConfig = {
      programId: pid,
      start: lstart,
      end: lend
    };
    console.log("rsa config", result);
    return result;
  }, [qConfig]);

  const qOffers = useQuery<AllScientistOffers>(ALL_OFFERS);
  const allOffers = useMemo(() => {
    const os = qOffers.data?.ScientistOffer || [];
    const fos = os.filter(o => o.programId === rsaConfig.programId);
    return fos;
  }, [qOffers, rsaConfig]);

  const offers = useMemo(() => {
    const sorted = allOffers.sort((a, b) => {
      const ac = a.RequestsCount.aggregate?.count || 0;
      const bc = b.RequestsCount.aggregate?.count || 0;
      return ac - bc;
    });
    const sos = shuffleSlices(sorted);
    return sos;
  }, [allOffers, rsaConfig]);

  const [finishedSchoolGradeSelection, setFinishedSchoolGradeSelection] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<number>(5);
  const [selectedSchool, setSelectedSchool] = useState<AllSchols_School | undefined>();
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedOffers, setSelectedOffers] = useState<SelectedOffers>({});

  const handleFinishSchoolGradeSelection = useCallback(() => {
    setFinishedSchoolGradeSelection(true);
  }, [setFinishedSchoolGradeSelection]);

  const handleResetSchoolGradeSelection = useCallback(() => {
    setSelectedSchool(undefined);
    setFinishedSchoolGradeSelection(false);
    setSelectedOffers({});
    setSearchText("");
    setFilterCategories([]);
    setSelectedGrade(5);
  }, [setFinishedSchoolGradeSelection, setSelectedSchool, setSelectedOffers, setSearchText, setFilterCategories, setSelectedGrade]);

  const handleToggleSelectDays = useCallback((offer: AllScientistOffers_ScientistOffer, days: number[]) => {
    const newSelected = {
      ...selectedOffers
    };
    if (days.length === 0) {
      delete newSelected[offer.id];
    } else {
      newSelected[offer.id] = days;
    }

    setSelectedOffers(newSelected);
  }, [selectedOffers, setSelectedOffers]);

  const selectedOffersList = useMemo(() => {
    const ids = Object.keys(selectedOffers).map(Number);
    const ogrp: Record<number, AllScientistOffers_ScientistOffer> = {};
    for (const ao of allOffers) {
      ogrp[ao.id] = ao;
    }
    return ids.map(id => ogrp[id]).filter(x => x != null);
  }, [selectedOffers, allOffers]);

  const handleSearchInput = useCallback((event) => {
    setSearchText(event?.target?.value || "");
  }, [setSearchText]);

  const filteredOffers = useMemo(() => {
    const allSchoolSubjects = collectSchoolSubjects(allOffers);
    const result = offers.filter(o =>
      filterOffer(o, filterCategories, allSchoolSubjects, searchText, selectedGrade, selectedSchool?.postalCode));
    return result;
  }, [allOffers, offers, searchText, filterCategories, selectedSchool, selectedGrade]);

  const handleRemoveSelection = useCallback((offer: AllScientistOffers_ScientistOffer) => {
    const newSelected = {
      ...selectedOffers
    };
    delete newSelected[offer.id];
    setSelectedOffers(newSelected);
  }, [selectedOffers, setSelectedOffers]);

  const schoolAndGradeSelected = useMemo(() => {
    return selectedGrade > 0 && selectedSchool !== undefined;
  }, [selectedSchool, selectedGrade]);

  return <div className={className}>

    <h1 className="mt-4 text-2xl font-bold">Schule und Klassenstufe</h1>

    {!finishedSchoolGradeSelection && <>

      <SchoolSelector
        className="mb-2"
        id={"index-page-school-selector-id"}
        instanceId={"index-page-school-selector-instance"}
        selectedSchool={selectedSchool}
        onSelectSchool={setSelectedSchool}
      />

      <GradeSelector
        className="mb-2"
        id={"index-page-grade-selector-id"}
        instanceId={"index-page-grade-selector-instance"}
        selectedGrade={selectedGrade}
        onSelectGrade={setSelectedGrade}
      />

      <div className="mb-4 mt-4 pl-5">
        <span className="mr-4">Wählen Sie im ersten Schritt Schule und Klassenstufe aus.</span>
        <Button onClick={handleFinishSchoolGradeSelection} disabled={!schoolAndGradeSelected} variant="outlined">
          Weiter
        </Button>

        <div>Wollen Sie mehrere Klassen anmelden, so können Sie den Prozess mehrfach durchlaufen</div>
      </div>

    </>}

    {
      finishedSchoolGradeSelection && <>

        <div className="flex">
          <div>
            Gewählte Schule: {" "}{selectedSchool?.name}<br/>
            Gewählte Klassenstufe: {" "}{selectedGrade}
          </div>
          <div className="ml-4">
          <Button onClick={handleResetSchoolGradeSelection} variant="outlined">
            Auswahlprozess Zurücksetzen
          </Button>
          </div>
        </div>

        <h1 className="mt-4 text-2xl font-bold">Kursauswahlstatus</h1>

        <RegistrationSelection
          selectedOffers={selectedOffersList}
          className="mb-2"
          onClickRemove={handleRemoveSelection}
        />

        <h1 className="mt-4 text-2xl font-bold">Kursoptionen für Ihre Klasse</h1>

        <CategorySelector
          forOffers={allOffers}
          instanceId="index-page-category-selector-instance"
          id="index-page-category-selector-id"
          selected={filterCategories}
          onSelectCategories={setFilterCategories}
          className="mb-2"
        />

        <Input
          className="w-full mb-2 pl-2 pr-2"
          placeholder="Filter Kurse nach Beschreibung"
          value={searchText}
          onChange={handleSearchInput}
        />

        <h1 className="mt-4 text-2xl font-bold">{filteredOffers.length} Angebote gefunden</h1>

        {
          filteredOffers.map(fo => <OfferDisplay
            config={rsaConfig}
            className="mb-8"
            key={fo.id}
            offer={fo}
            onToggleSelectedDays={handleToggleSelectDays}
            selectedDays={selectedOffers[fo.id] || []}
          />)
        }


      </>
    }

  </div>
}